import "../styles/main.css";
import navigation from "./navigation";
import content from "./content";
import feed from "./feed";

window.$ = (selector) => document.querySelector(selector);
window.$$ = (selector) => document.querySelectorAll(selector);

// ---------- STATE MANAGEMENT ---------- //

let currentBlog = {
  value: new URLSearchParams(window.location.search).get("blog"),
  update: (blog) => {
    history.pushState({ blog }, "", `?blog=${blog}`);

    searchQuery.value = "";
    currentBlog.value = blog;
    render();
  },
};

let searchQuery = {
  value: new URLSearchParams(window.location.search).get("search") ?? "",
  update: (query) => {
    query = query.toLowerCase();
    searchQuery.value && query
      ? history.replaceState({ query }, "", `?search=${query}`)
      : history.pushState({ query }, "", query ? `?search=${query}` : "/");

    searchQuery.value = query;
    currentBlog.value = null;
    render();
  },
};

// ---------- STATIC FETCHING ---------- //

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
  $("#root").innerHTML =
    `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
  console.error(error);
}

let welcomeMessage = `
  <div class="content">
    <h1> ${welcome.heading} </h1>
    <p> ${welcome.line_1} </p>
    <p> ${welcome.line_2} </p>
    <p> ${welcome.line_3} </p>
  </div>`;

// ---------- COMPONENTS RENDERING ---------- //

const render = async () => {
  let blogData = blogsList.find((blog) => blog.path == currentBlog.value);

  if (!$(".navigation"))
    $("#root").insertAdjacentHTML("beforebegin", navigation());
  $(".searchConsumer").value = searchQuery.value;

  $("#root").innerHTML = !currentBlog.value
    ? feed(blogsList, searchQuery)
    : content(blogData);
  
  if (!searchQuery.value && !currentBlog.value) {
    document.title = welcome.name;
    $("#root").insertAdjacentHTML("afterbegin", welcomeMessage);
  }

  window.scrollTo(0, 0);

  // ---------- LISTENERS ATTACHEMENT ---------- //

  setTimeout(() => {
    window.onpopstate = () => {
      currentBlog.value = new URLSearchParams(window.location.search).get("blog");
      searchQuery.value = new URLSearchParams(window.location.search).get("search") ?? "";
      render();
    };

    $$(".blogProvider").forEach((element) => {
      element.onclick = () => currentBlog.update(element.dataset.blog);
    });

    $$(".searchProvider").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.oninput = () => searchQuery.update(element.value))
        : (element.onclick = () => searchQuery.update(element.dataset.query));
    });
  }, 250);
};
render();
