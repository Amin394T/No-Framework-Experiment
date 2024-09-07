import "../styles/navigation.css";

let searchWord = {
  value: "",
  update: (query) => {
    searchWord.value = query;
    document.querySelectorAll(".searchConsumer").forEach((element) => {
      element.innerHTML = searchWord.value;
    });
  },
};

let navigation = () => `
  <div>
    <input class="searchObserver" placeholder="🔍  Search ..." value="${searchWord.value}" />
    <div class="searchConsumer">${searchWord.value}</div>
  </div>
`;


export { searchWord };
export default navigation;
/*
`<div className="navigation">
      <img className="navigation-logo" src="./images/_logo.png" onClick=() => handleSearch("") />
      <input
        className="navigation-search" value={searchWord} placeholder="🔍  Search ..."
        onChange={(event) => handleSearch(event.target.value)}
      />
    </div>`;*/
