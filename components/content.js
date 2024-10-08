import "../styles/content.css";
import { marked } from "marked";

const contentFetch = async (blogData) => {
  try {
    const response = await fetch(`./markdown/${blogData?.path}.md`);
    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`);
    if (response.headers.get("content-type") != "text/markdown")
      throw new Error("File Not Found!");
    
    document.title = `Reading: "${blogData.title}"`;

    $(".content").innerHTML = `
      <h1>${blogData.title}</h1>

      <div class="content-info">  
        <span>📘 &nbsp;${blogData.tags[0]}</span>
        <span>🖊️ &nbsp;${blogData.author}</span>
        <span>🕓 &nbsp;${blogData.date}</span>
      </div>

      ${marked(await response.text())}

      <span class="content-tags">
        ${blogData.tags.map((tag) =>
          `<span class="searchProvider" data-query="${tag}">${tag}</span>`).join("")}
      </span>
    `;
  } catch (error) {
    $(".content").outerHTML =
      `<div class="error"> <div>&#x2716;</div> Oops! Something went wrong. </div>`;
    console.error(error);
  }
};

const content = (blogData) => {
  contentFetch(blogData);
  return `<div class="content"><div class="loading"> <div></div> </div></div>`;
};

export default content;
