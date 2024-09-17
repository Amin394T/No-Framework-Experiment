(work in progress ...)

# NO FRAMEWORK EXPERMENT
This is a re-creation of an SPA made with React, only using vanilla JavaScript, no third party library has been used, except for "marked" which handles Markdown connversion to HTML.


## STATE DECLARATION
```js
let searchQuery = {
  value: "",// new URLSearchParams(window.location.search).get("search") ?? "",
  update: (query) => {
    query = query.toLowerCase();
    // searchQuery.value && query
    //   ? history.replaceState({ query }, "", `?search=${query}`)
    //   : history.pushState({ query }, "", `?search=${query}`);

    searchQuery.value = query;
    currentBlog.value = null;

    $(".searchConsumer").value = searchQuery.value;
    render();
  },
};
```

## CONSTANTS PREPARATION

## COMPONENTS RENDERING 

## LISTENERS ATTACHEMENT

## ROUTING MANAGEMENT
