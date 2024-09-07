import "../styles/content.css";
import { marked } from "marked";

let content = async (blogData, handleSearch) => {
  // const { data, status } = useFetch(`./markdown/${blogData.path}.md`);
  // if (status == "loading")
  //   return (<div class="spinner content"> <div></div> </div>);
  // if (status == "error" || !blogData)
  //   return (<div class="error content"> <div>&#x2716;</div> Oops! Something went wrong. </div>);

  document.title = blogData.title;

  const response = await fetch(`./markdown/${blogData.path}.md`);
  const data = await response.text();

  console.log(blogData)

  return `
    <div class="content">
      <h1>${blogData.title}</h1>

      <div class="content-info">  
        <span>📘 &nbsp;${blogData.tags[0]}</span>
        <span>🖊️ &nbsp;${blogData.author}</span>
        <span>🕓 &nbsp;${blogData.date}</span>
      </div>

      ${marked(data)}
      
      <span class="content-tags">
        ${blogData.tags.map((tag) => `<span class="searchProvider" data="${tag}">${tag}</span>`).join("")}
      </span>
    </div>
  `;
};

export default content;
