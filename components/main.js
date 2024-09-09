import "../styles/main.css";
import navigation from "./navigation.js";
import content from "./content";
import feed from "./feed";

let searchQuery = {
  value: "",
  update: (query) => {
    searchQuery.value = query.toLowerCase();
    document.querySelectorAll(".searchConsumer").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.value = searchQuery.value)
        : (element.innerHTML = searchQuery.value);
    });
  },
};

let currentBlog = {
  value: new URLSearchParams(window.location.search).get("blog"),
  update: (blog) => {
    currentBlog.value = blog;
    document.querySelectorAll(".blogConsumer").forEach((element) => {
      element.innerHTML = currentBlog.value;
    });
  },
};

// -------------------- //

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
  ${navigation(searchQuery)}
  ${!currentBlog.value ? feed(blogsList, searchQuery) : content(blogData)}
`;

// -------------------- //

setTimeout(() => {
  document.querySelectorAll(".blogProvider").forEach((element) => {
    element.onclick = () => currentBlog.update(element.dataset.blog);
  });

  document.querySelectorAll(".searchProvider").forEach((element) => {
    element.tagName == "INPUT"
      ? (element.oninput = () => searchQuery.update(element.value))
      : (element.onclick = () => searchQuery.update(element.dataset.query));
  });
}, 500);

//   const welcome = JSON.parse(useFetch("./markdown/_welcome.json").data);

//   window.onpopstate = () => {
//     setCurrentBlog(new URLSearchParams(window.location.search).get("blog"));
//     document.title = welcome.name;
//   };

//   let handleSearch = (query) => {
//     startTransition(() => setSearchWord());
//     setCurrentBlog(null);
//     window.scrollTo(0, 0);
//     history.pushState({}, "", window.location.pathname);
//     document.title = welcome.name;
//   };

//   let handleSelection = (path) => {
//     setCurrentBlog(path);
//     setSearchWord("");
//     window.scrollTo(0, 0);
//     history.pushState({ blog: path }, "", `?blog=${path}`);
//   };

//   return (
//     <>
//       <Navigation {...{ searchWord, handleSearch }} />

//       { !currentBlog && !searchWord &&
//         <div className="content">
//           <h1> {welcome.heading} </h1>
//           <p> {welcome.line_1} </p>
//           <p> {welcome.line_2} </p>
//           <p> {welcome.line_3} </p>
//         </div> }

//       { currentBlog && <Content {...{ blogData, handleSearch }} /> }
//       { !currentBlog && <Feed {...{ blogsList, handleSelection, searchWord }} /> }
//     </>
//   );
// }
