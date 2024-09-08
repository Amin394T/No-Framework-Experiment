import "../styles/content.css";
import fetchData from "../utilities/fetchData";
import { marked } from "marked";

let content = (blogData) => {
  let fetchContent = async () => {
    const data = await fetchData(`./markdown/${blogData.path}.md`);

    document.title = blogData.title;

    document.querySelectorAll(".content").forEach((element) => {
      element.innerHTML = `
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
      `;
    });
  };
  fetchContent();

  return `
    <div class="content">
      <div class="loading"> <div></div> </div>
      <div class="error" style="display: none"> <div>&#x2716;</div> Oops! Something went wrong. </div>
    </div>
  `;
};

export default content;
