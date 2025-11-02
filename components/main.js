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
let home;

try {
  $("#root").innerHTML = `<div class="loading"> <div></div> </div>`;

  let response = await fetch("./markdown/_home.json");
  home = await response.json();

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
    document.title = home.name;
    $("#root").insertAdjacentHTML("afterbegin",
      `<div class="content">
        <h1> ${home.heading} </h1>
        ${ Object.keys(home)
          .filter((key) => key.startsWith("line_"))
          .map((key) => `<p>${home[key]}</p>`)
          .join('')
        }
      </div>`
    );
  }
  window.scrollTo(0, 0);

  // ---------- LISTENERS ATTACHEMENT ---------- //

  window.onpopstate = () => {
    const params = new URLSearchParams(window.location.search);
    currentBlog.get = params.get("blog");
    searchQuery.get = params.get("search") ?? "";
    render();
  };

  document.addEventListener("click", (element) => {
    const blog = element.target.closest(".blogProvider");
    if (blog) {
      currentBlog.set(blog.dataset.blog);
      return;
    }

    const query = element.target.closest(".searchProvider");
    if (query && query.tagName != "INPUT") {
      searchQuery.set(query.dataset.query || "");
    }
  });

  document.addEventListener("input", (element) => {
    const input = element.target.closest(".searchProvider");
    if (input && input.tagName == "INPUT") {
      searchQuery.set(input.value);
    }
  });
};
render();
