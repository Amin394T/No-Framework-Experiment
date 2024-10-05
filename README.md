# NO FRAMEWORK EXPERMENT
This is a re-creation of an SPA made with React, only using vanilla JavaScript, no third party library has been used, except for "marked" which handles Markdown connversion to HTML. **This is a mere personal notes file, not a verified source of information**.


## STATE DECLARATION

States are objects containing a getter and a setter. The getter is initialized with a default value, in the example below, "searchQuery" is null, though in the application it reads a URL parameter (as shown in the commented line).

The setter is a function that changes the state value and executes side effets (equivalent of both useState and useEffect), in this example, it updates the state (after applying "toLowerCase()" to it), then it updates another state via a direct affectation of its getter (if the setter were to be used, it will result in an infinite loop if that state's setter also calls this state's setter, so as a convention, never call a setter inside a setter), then it re-renders the page so that the state's change takes effect on the page.

```js
let searchQuery = {
  get: "",// new URLSearchParams(window.location.search).get("search") ?? "",
  set: (query) => {
    query = query.toLowerCase();
    // searchQuery.value && query
    //   ? history.replaceState({ query }, "", `?search=${query}`)
    //   : history.pushState({ query }, "", `?search=${query}`);

    searchQuery.get = query;
    currentBlog.get = null;

    render();
  },
};
```
In some cases, executing a re-render can be an overkill and optimizing the render function for that case could be tedious, instead, it is recommended to modify the DOM within the setter function, the example bellow looks for inputs and text that have the "searchConsumer" class and updates them with the new state value:

```js
$$(".searchConsumer").forEach((element) => {
  element.tagName == "INPUT"
    ? (element.value = searchQuery.get)
    : (element.innerHTML = searchQuery.get);
});
```
Using the "this" keyword inside the setter has been avoided.


## VARIABLES PREPARATION

Values that are not to be re-declared upon re-render are declared outside the render function, in the below example, the whole list of blogs is fetching in the begining, regardless if all its content is shown or not, in other cases, such as when fetching whole list is expensive so pagination-based fetching is adopted, data fetching would be done inside the render function, or inside a component, called by the latter eventually.

```js
let blogsList = [];

try {
  $("#root").innerHTML = `<div class="loading"> <div></div> </div>`;
  response = await fetch("./markdown/_files_list.json");
  
  if (!response.ok)
    throw new Error(`HTTP error! Status: ${response.status}`);
  blogsList = await response.json();
}
catch (error) {
  $("#root").innerHTML = `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
  console.error(error);
}
```


## COMPONENTS RENDERING

Reactive rendering is the perhaps the most tricky part to implement, as simply re-rendering everything at state change is not optimal and might result in poor performance, in our case things are simple, the page is separated into 2 main sections, the navigation bar, which doesn't need re-rendering, and the content area, which is shared by the blogs list view and blog content view, and is thus dependant on state.

The render function checks if the navigation bar already exists to avoid re-rendering it, then proceeds to determine which of the 2 views (blogs list or blog content) to display, with the correct properties passed to them as function arguments

```js
const render = async () => {
  let blogData = blogsList.find((blog) => blog.path == currentBlog.get);

  !$(".navigation")
    ? $("#root").insertAdjacentHTML("beforebegin", navigation())
    : $(".searchConsumer").value = searchQuery.get;

  $("#root").innerHTML = !currentBlog.get ? feed(blogsList, searchQuery) : content(blogData);
}
```

You might want to scroll back to the top of the page after some/all re-reders, simply add the following where needed, usually at the end of "render()", right before listeners attachement:

```js
window.scrollTo(0, 0);
```

In larger applications, you can pass an argument to "render()" to make conditional rendering easier to manage, here's an example :

```js
let searchQuery = {
  get: "",
  set: (query) => {
    query = query.toLowerCase();
    searchQuery.get = query;
    currentBlog.get = null;

    render('FEED');
  },
};

const render = async (mode) => {
  let blogData = blogsList.find((blog) => blog.path == currentBlog.get);

  if(mode == 'FULL') {
    document.querySelector("#root").innerHTML = `
      ${navigation()}
      ${!currentBlog.get ? feed(blogsList, searchQuery) : content(blogData)}
    `;
  }

  if(mode == 'CONTENT') {
    $(".feed").outerHTML = content(blogData);
    $(".searchConsumer").value = searchQuery.get;
  }

  if(mode == 'FEED') {
    $(".content").outerHTML = feed(blogsList, searchQuery);
    $(".searchConsumer").value = searchQuery.get;
  }
}

```

As an alternative approach, you can replace the "render()" function the first paint's code, then manage all changes inside the setter function of states, it is not recommended to adopt this practice especially in larger applications with multiple states, keeping all DOM-manipulating code centralized inside the "render()" function is recommended. In the following example, the DOM is searched for occurences of the "searchConsumer" class, which is a flag indicating that the state was used, if an input is found, its "value" property is updated, if it's a tag with text in it, its "innerHTML" is updated.

```js
let searchQuery = {
  get: "",
  set: (query) => {
    query = query.toLowerCase();
    searchQuery.get = query;
    currentBlog.get = null;

    $(".content").outerHTML = feed(blogsList, searchQuery);
    document.querySelectorAll(".searchConsumer").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.value = searchQuery.get)
        : (element.innerHTML = searchQuery.get);
    });
  }
};
```


## LISTENERS ATTACHEMENT

Listeners are attached to DOM elemnts after they're rendered, this operation is delayed using "setTimout()" due to the existance of asynchronous components, which might not be rendered yet at the time of listener attachement, otherwise there is no need to delay this operation.

The code below looks for elements tagged with the "searchProvider" class, if it's an input, it attaches an "oninput" event trigger to it, otherwise an "onclick" event trigger, and in both cases, the event is used to update the "searchQuery" state.

```js
const render = async () => {
  
  // RENDERING LOGIC //

  setTimeout(() => {
    // window.onpopstate = () => {
    //   searchQuery.get = new URLSearchParams(window.location.search).get("search") ?? "";
    //   render();
    // };

    $$(".searchProvider").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.oninput = () => searchQuery.set(element.value))
        : (element.onclick = () => searchQuery.set(element.dataset.query));
    });
  }, 250);
};
```


## ROUTING MANAGEMENT

Rounting was managed using the browser history API, by reading and writing the states to the URL (the local storage could also be used). Writing is done inside the state setter, while reading is done in the listeners attachement stage.

In our case, if "searchQuery" value is null, a new entry with the parametered URL is pushed to the browser history, if it's not empty, this indicated that the user typed another character, there is no need to push another entry th the history, instead the previous entry is overriden, this way clogging the history with entries for each key stroke is avoided, and thus a more logical navigation is assured.

```js
let searchQuery = {
  get: new URLSearchParams(window.location.search).get("search") ?? "",
  set: (query) => {
    query = query.toLowerCase();
    searchQuery.value && query
      ? history.replaceState({ query }, "", `?search=${query}`)
      : history.pushState({ query }, "", `?search=${query}`);

    searchQuery.get = query;
    currentBlog.get = null;

    render();
  },
};
```

After URL request or history navigation (when previous or forward buttons are pressed), the application reads the URL parameters and sets the states accordingly, the states are updated directly, setters were not used, this is because many states might be present in the URL, each has a "render()" function in its setter, so to avoid issues they were updated using the getter and "render()" was called afterwards.

```js
const render = async () => {
  
  // RENDERING LOGIC //

  setTimeout(() => {
    window.onpopstate = () => {
      searchQuery.get = new URLSearchParams(window.location.search).get("search") ?? "";
      render();
    };

    // OTHER LISTERNER ATTACHEMENTS //
    
  }, 250);
};
```