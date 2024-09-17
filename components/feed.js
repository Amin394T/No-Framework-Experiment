import "../styles/feed.css";

const feed = (blogsList, searchQuery) => {
  document.title = `Searching: "${searchQuery.get}"`;
  
  let filteredBlogs = blogsList.filter((blog) =>
      blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.get)) ||
      blog.title.toLowerCase().includes(searchQuery.get)
  );
  
  let sortedBlogs = filteredBlogs.sort((blog1, blog2) => new Date(blog2.date) - new Date(blog1.date));

  return `
    <div class="feed">
      ${sortedBlogs.map((blog) => `
        
        <div class="feed-blog blogProvider" data-blog="${blog.path}">
          <span>${blog.tags[0]}</span>
          <img src="./images/${blog.image || "_placeholder.png"}" />
          <div>${blog.title}</div>
        </div>
        
      `).join("")}
    </div>
  `;
};

export default feed;