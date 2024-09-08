import "../styles/content.css";
import { marked } from "marked";

let content = async (blogData) => {

  document.querySelector("#root").innerHTML += `<div class="content"></div>`;
  
  try {
    document.querySelector(".content").innerHTML = `<div class="loading"> <div></div> </div>`;
    const response = await fetch(`./markdown/${blogData.path}.md`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    document.title = blogData.title;

    document.querySelector(".content").innerHTML = `
      <h1>${blogData.title}</h1>

      <div class="content-info">  
        <span>📘 &nbsp;${blogData.tags[0]}</span>
        <span>🖊️ &nbsp;${blogData.author}</span>
        <span>🕓 &nbsp;${blogData.date}</span>
      </div>

      ${marked(await response.text())}
      
      <span class="content-tags">
        ${blogData.tags.map((tag) => `<span class="searchProvider" data="${tag}">${tag}</span>`).join("")}
      </span>
    `;
  }
  catch (error) {
    document.querySelector(".content").outerHTML = `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
      console.error(error);
  }

};

export default content;
