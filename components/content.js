import "../styles/Content.css";
import useFetch from "../utilities/useFetch";
import Markdown from "react-markdown";

function Content({ blogData, handleSearch }) {

  const { data, status } = useFetch(`./markdown/${blogData.path}.md`);
  if (status == "loading")
    return (<div className="spinner content"> <div></div> </div>);
  if (status == "error" || !blogData)
    return (<div className="error content"> <div>&#x2716;</div> Oops! Something went wrong. </div>);

  document.title = blogData.title;

  return (
      <div className="content">
        <h1>{blogData.title}</h1>

        <div className="content-info">  
          <span>📘 &nbsp;{blogData.tags[0]}</span>
          <span>🖊️ &nbsp;{blogData.author}</span>
          <span>🕓 &nbsp;{blogData.date}</span>
        </div>

        <Markdown>{data}</Markdown>
        
        <span className="content-tags">
          { blogData.tags.map((tag) => <span key={tag} onClick={() => handleSearch(tag)}>&#35; {tag}</span>) }
        </span>
      </div>
  );
}

export default Content;