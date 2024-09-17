# NO FRAMEWORK EXPERMENT
This is a re-creation of an SPA made with React, only using vanilla JavaScript, no third party library has been used, except for "marked" which handles Markdown connversion to HTML.


## STATE DECLARATION
```js
let currentBlog = {
  value: new URLSearchParams(window.location.search).get("blog"),
  update: (blog) => {
    history.pushState({ blog }, "", `?blog=${blog}`);

    searchQuery.value = "";
    currentBlog.value = blog;
    render();
  },
};
```

## CONSTANTS PREPARATION

## COMPONENTS RENDERING 

## LISTENERS ATTACHEMENT

## ROUTING MANAGEMENT


WIP