import "../styles/main.css";
import navigation from "./navigation";
import content from "./content";
import feed from "./feed";

window.$ = (selector) => document.querySelector(selector);
window.$$ = (selector) => document.querySelectorAll(selector);

// ---------- STATE DECLARATION ---------- //

let currentBlog = {
  get: new URLSearchParams(window.location.search).get("blog"),
  set: (blog) => {
    history.pushState({ blog }, "", `?blog=${blog}`);

    searchQuery.get = "";
    currentBlog.get = blog;
    render();
  },
};

let searchQuery = {
  get: new URLSearchParams(window.location.search).get("search") ?? "",
  set: (query) => {
    query = query.toLowerCase();
    (searchQuery.get && query) || (!currentBlog.get && !searchQuery.get && !query)
      ? history.replaceState({ query }, "", `?search=${query}`)
      : history.pushState({ query }, "", `?search=${query}`);

    searchQuery.get = query;
    currentBlog.get = null;
    render();
  },
};

// ---------- CONSTANTS PREPARATION ---------- //

let blogsList = [];
let welcome;

try {
  $("#root").innerHTML = `<div class="loading"> <div></div> </div>`;

  let response = await fetch("./markdown/_welcome.json");
  welcome = await response.json();

  response = await fetch("./markdown/_files_list.json");
  if (!response.ok)
    throw new Error(`HTTP error! Status: ${response.status}`);
  blogsList = await response.json();
}
catch (error) {
  $("#root").innerHTML = `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
  console.error(error);
}

// ---------- COMPONENTS RENDERING ---------- //

const render = async () => {
  let blogData = blogsList.find((blog) => blog.path == currentBlog.get);

  !$(".navigation")
    ? $("#root").insertAdjacentHTML("beforebegin", navigation())
    : $(".searchConsumer").value = searchQuery.get;

  $("#root").innerHTML = !currentBlog.get ? feed(blogsList, searchQuery) : content(blogData);
  
  if (!searchQuery.get && !currentBlog.get) {
    document.title = welcome.name;
    $("#root").insertAdjacentHTML("afterbegin",
      `<div class="content">
        <h1> ${welcome.heading} </h1>
        <p> ${welcome.line_1} </p>
        <p> ${welcome.line_2} </p>
        <p> ${welcome.line_3} </p>
      </div>`
    );
  }
  window.scrollTo(0, 0);

  // ---------- LISTENERS ATTACHEMENT ---------- //

  setTimeout(() => {
    window.onpopstate = () => {
      currentBlog.get = new URLSearchParams(window.location.search).get("blog");
      searchQuery.get = new URLSearchParams(window.location.search).get("search") ?? "";
      render();
    };

    $$(".blogProvider").forEach((element) => {
      element.onclick = () => currentBlog.set(element.dataset.blog);
    });

    $$(".searchProvider").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.oninput = () => searchQuery.set(element.value))
        : (element.onclick = () => searchQuery.set(element.dataset.query));
    });
  }, 250);
};
render();
