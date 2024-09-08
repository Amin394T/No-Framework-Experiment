import "../styles/content.css";
import { marked } from "marked";

let content = (blogData) => {
  fetch(`./markdown/${blogData.path}.md`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      document.title = blogData.title;

      document.querySelector(".content").innerHTML = `
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
    })
    .catch((error) => {
      document.querySelector(".content").outerHTML = `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
      console.error(error);
    });

  return `
    <div class="content">
      <div class="loading"> <div></div> </div>
    </div>
  `;
};

export default content;
