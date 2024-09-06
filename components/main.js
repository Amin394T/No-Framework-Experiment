let counter = {
  value: 0,
  updater: function (count) {
    this.value = count;
    render();
  },
};

function render() {
  const node = document.querySelector("#root");
  node.innerHTML = "";
  node.innerHTML = `
    <div>
      <h1>Hello, World!</h1>
      <button class="counter" type="button">${counter.value}</button>
      <button class="counter" type="button">${counter.value * 2}</button>
    </div>
  `;

  document.querySelectorAll(".counter").forEach((button) => {
    button.onclick = () => counter.updater(counter.value + 1);
  });
}
render();

/*
import "../styles/App.css";
import Navigation from "./Navigation";
import Content from "./Content";
import Feed from "./Feed";

let currentBlog = {
  value: new URLSearchParams(window.location.search).get("blog"),
  updater: function (blogID) {
    this.value = blogID;
    document.querySelectorAll(".blogObserver").forEach((element) => {
      element.innerHTML = this.value;
    });
  },
};

let searchWord = {
  value: "",
  updater: function (query) {
    this.value = query;
    document.querySelectorAll(".blogObserver").forEach((element) => {
      element.innerHTML = this.value;
    });
  },
};

function App() {
  const [currentBlog, setCurrentBlog] = useState(new URLSearchParams(window.location.search).get("blog"));
  const [searchWord, setSearchWord] = useState("");

  const welcome = JSON.parse(useFetch("./markdown/_welcome.json").data);
  
  window.onpopstate = () => {
    setCurrentBlog(new URLSearchParams(window.location.search).get("blog"));
    document.title = welcome.name;
  };

  const { data, status } = useFetch("./markdown/_files_list.json");
  if (status == "loading")
    return (<div className="spinner"> <div></div> </div>);
  if (status == "error" || !data)
    return (<div className="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>);

  const blogsList = JSON.parse(data);
  const blogData = blogsList.find((blog) => blog.path == currentBlog);

  let handleSearch = (query) => {
    startTransition(() => setSearchWord(query.toLowerCase()));
    setCurrentBlog(null);
    window.scrollTo(0, 0);
    history.pushState({}, "", window.location.pathname);
    document.title = welcome.name;
  };

  let handleSelection = (path) => {
    setCurrentBlog(path);
    setSearchWord("");
    window.scrollTo(0, 0);
    history.pushState({ blog: path }, "", `?blog=${path}`);
  };

  return (
    <>
      <Navigation {...{ searchWord, handleSearch }} />

      { !currentBlog && !searchWord &&
        <div className="content">
          <h1> {welcome.heading} </h1>
          <p> {welcome.line_1} </p>
          <p> {welcome.line_2} </p>
          <p> {welcome.line_3} </p>
        </div> }

      { currentBlog && <Content {...{ blogData, handleSearch }} /> }
      { !currentBlog && <Feed {...{ blogsList, handleSelection, searchWord }} /> }
    </>
  );
}

export default App;
*/
