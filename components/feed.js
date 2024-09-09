import "../styles/feed.css";

let feed = (blogsList, searchQuery) => {
  const filteredBlogs = blogsList.filter((blog) =>
      blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.value)) ||
      blog.title.toLowerCase().includes(searchQuery.value)
  );
  
  const sortedBlogs = filteredBlogs.sort((blog1, blog2) => new Date(blog2.date) - new Date(blog1.date));

  return `
    <div class="feed">
      ${sortedBlogs.map((blog) => `
        
        <div class="feed-blog blogProvider" data-blog="${blog.path}">
          <span>${blog.tags[0]}</span>
          <img src="./images/${blog.image || "_placeholder.png"}" />
          <div>${blog.title}</div>
        </div>
        
      `).join('')}
    </div>
  `;
};

export default feed;