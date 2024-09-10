import "../styles/main.css";
import navigation from "./navigation.js";
import content from "./content";
import feed from "./feed";

let currentBlog = {
  value: new URLSearchParams(window.location.search).get("blog"),
  update: (blog) => {
    currentBlog.value = blog;
    searchQuery.update("");
    window.scrollTo(0, 0);
    history.pushState({ blog }, "", `?blog=${blog}`);
    render();
  },
};

let searchQuery = {
  value: "",
  update: (query) => {
    searchQuery.value = query.toLowerCase();
    //currentBlog.update(null);
    window.scrollTo(0, 0);
    history.pushState({}, "", window.location.pathname);
    //document.title = welcome.name;
    render();

    document.querySelectorAll(".searchConsumer").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.value = searchQuery.value)
        : (element.innerHTML = searchQuery.value);
    });
  },
};

// -------------------- //

const render = async () => {
  
  let blogsList = [];

  try {
    document.querySelector("#root").innerHTML = `<div class="loading"> <div></div> </div>`;
    const response = await fetch("./markdown/_files_list.json");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    blogsList = await response.json();
  }
  catch (error) {
    document.querySelector("#root").innerHTML = `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
    console.error(error);
  }

  let blogData = blogsList.find((blog) => blog.path == currentBlog.value);

  document.querySelector("#root").innerHTML = `
    ${navigation()}
    ${!currentBlog.value ? feed(blogsList, searchQuery) : content(blogData)}
  `;

  // -------------------- //

  setTimeout(() => {
    window.onpopstate = () => {
      currentBlog.update("");
      //document.title = welcome.name;
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
await render();


//   const welcome = JSON.parse(useFetch("./markdown/_welcome.json").data);
//       { !currentBlog && !searchWord &&
//         <div className="content">
//           <h1> {welcome.heading} </h1>
//           <p> {welcome.line_1} </p>
//           <p> {welcome.line_2} </p>
//           <p> {welcome.line_3} </p>
//         </div> }