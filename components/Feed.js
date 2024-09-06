import "../styles/Feed.css";

function Feed({ blogsList, handleSelection, searchWord }) {

  const filteredBlogs = blogsList.filter((blog) => 
      (blog.tags.some(tag => tag.toLowerCase().includes(searchWord))) ||
      (blog.title.toLowerCase().includes(searchWord))
  );
  const sortedBlogs = filteredBlogs.sort((blog1, blog2) => new Date(blog2.date) - new Date(blog1.date));

  return (
    <div className="feed">
      { sortedBlogs.map((blog) => (

        <div className="feed-blog" onClick={() => handleSelection(blog.path)} key={blog.path}>
          <span>{blog.tags[0]}</span>
          <img src={`./images/${blog.image || "_placeholder.png"}`} />
          <div>{blog.title}</div>
        </div>
      
      )) }
    </div>
  );
}

export default Feed;
