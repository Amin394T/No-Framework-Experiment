import "../styles/content.css";
import { marked } from "marked";

const contentFetch = async (blogData) => {
  try {
    const data = await fetch(`./markdown/${blogData?.path}.md`);
    if (!data.ok)
      throw new Error(`HTTP error! Status: ${data.status}`);
    if (data.headers.get("content-type") != "text/markdown")
      throw new Error("File Not Found!");
    
    document.title = blogData.title;

    $(".content").innerHTML = `
      <h1>${blogData.title}</h1>

      <div class="content-info">  
        <span class="content-topic searchProvider" data-query="${blogData.tags[0]}">📘 &nbsp;${blogData.tags[0]}</span>
        <span class="content-author searchProvider" data-query="${blogData.author}">🖊️ &nbsp;${blogData.author}</span>
        <span>🕓 &nbsp;${blogData.date}</span>
      </div>

      ${marked(await data.text())}

      <span class="content-tags">
        ${blogData.tags.map((tag) => `
          <span class="searchProvider" data-query="${tag}">${tag}</span>
        `).join("")}
      </span>
    `;
  }
  catch (error) {
    $(".content").outerHTML = `
      <div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>
    `;
    console.error(error);
  }
};

const content = (blogData) => {
  contentFetch(blogData);
  return `<div class="content"><div class="loading"> <div></div> </div></div>`;
};

export default content;
