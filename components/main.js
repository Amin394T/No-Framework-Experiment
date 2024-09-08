import "../styles/main.css";
import navigation from "./navigation.js";
import content from "./content";
import feed from "./feed";

let currentBlog = {
  value: new URLSearchParams(window.location.search).get("blog"),
  update: (blogID) => {
    currentBlog.value = blogID;
    document.querySelectorAll(".blogConsumer").forEach((element) => {
      element.innerHTML = currentBlog.value;
    });
  },
};

let searchWord = {
  value: "",
  update: (query) => {
    searchWord.value = query.toLowerCase();
    document.querySelectorAll(".searchConsumer").forEach((element) => {
      element.tagName == "INPUT"
        ? (element.value = searchWord.value)
        : (element.innerHTML = searchWord.value);
    });
  },
};

// -------------------- //

const response = await fetch("./markdown/_files_list.json");

const blogsList = await response.json();
const blogData = blogsList.find((blog) => blog.path == currentBlog.value);

// -------------------- //

document.querySelector("#root").innerHTML = `
  ${navigation(searchWord)}
  ${content(blogData)}
`;

document.querySelectorAll(".blogProvider").forEach((element) => {
  element.onclick = () => currentBlog.update("");
});

document.querySelectorAll(".searchProvider").forEach((element) => {
  element.tagName == "INPUT"
    ? (element.oninput = (event) => searchWord.update(event.target.value))
    : (element.onclick = (event) => searchWord.update(event.target.getAttribute("data")));
});

//   const welcome = JSON.parse(useFetch("./markdown/_welcome.json").data);

//   window.onpopstate = () => {
//     setCurrentBlog(new URLSearchParams(window.location.search).get("blog"));
//     document.title = welcome.name;
//   };

//   const { data, status } = useFetch("./markdown/_files_list.json");
//   if (status == "loading")
//     return (<div className="spinner"> <div></div> </div>);
//   if (status == "error" || !data)
//     return (<div className="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>);

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
