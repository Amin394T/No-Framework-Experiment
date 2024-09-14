import "../styles/main.css";
import navigation from "./navigation.js";
import content from "./content";
import feed from "./feed";

let currentBlog = {
  value: new URLSearchParams(window.location.search).get("blog"),
  update: (blog) => {
    history.pushState({ blog }, "", `?blog=${blog}`);
    searchQuery.value = "";
    currentBlog.value = blog;
    render("partial");
  },
};

let searchQuery = {
  value: new URLSearchParams(window.location.search).get("search") ?? "",
  update: (query) => {
    searchQuery.value
      ? history.replaceState({ query }, "", `?search=${query}`)
      : history.pushState({ query }, "", `?search=${query}`);
    
    searchQuery.value = query.toLowerCase();
    currentBlog.value = null;
    document.querySelector(".searchConsumer").value = searchQuery.value;
    render("partial");
  },
};

// -------------------- //

const render = async (mode) => {
  
  let blogsList = [];

  try {
    if (mode == "full")
      document.querySelector("#root").innerHTML = `<div class="loading"> <div></div> </div>`;
    
    const response = await fetch("./markdown/_files_list.json");
    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`);
    blogsList = await response.json();
  }
  catch (error) {
    document.querySelector("#root").innerHTML =
      `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
    console.error(error);
  }

  let blogData = blogsList.find((blog) => blog.path == currentBlog.value);

  if (mode == "partial") {
    document.querySelector(".navigation").nextElementSibling.outerHTML =
      !currentBlog.value ? feed(blogsList, searchQuery) : content(blogData);
    document.querySelector(".navigation-search").value = searchQuery.value;
  } else {
    document.querySelector("#root").innerHTML = `
      ${navigation()}
      ${!currentBlog.value ? feed(blogsList, searchQuery) : content(blogData)}`;
  }

  if (!searchQuery.value && !currentBlog.value) document.title = "Personal Blog" //welcome.name;
  window.scrollTo(0, 0);

  // -------------------- //

  setTimeout(() => {
    window.onpopstate = () => {
      currentBlog.value = new URLSearchParams(window.location.search).get("blog");
      searchQuery.value = new URLSearchParams(window.location.search).get("search") ?? "";
      render("partial");
    };
  
    document.querySelectorAll(".blogProvider").forEach((element) => {
      element.onclick = () => currentBlog.update(element.dataset.blog);
    });
  
    document.querySelectorAll(".searchProvider").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.oninput = () => searchQuery.update(element.value))
        : (element.onclick = () => searchQuery.update(element.dataset.query));
    });
  }, 500);
};
await render("full");


//   const welcome = JSON.parse(useFetch("./markdown/_welcome.json").data);
//       { !currentBlog && !searchWord &&
//         <div className="content">
//           <h1> {welcome.heading} </h1>
//           <p> {welcome.line_1} </p>
//           <p> {welcome.line_2} </p>
//           <p> {welcome.line_3} </p>
//         </div> }