import "../styles/navigation.css";

let navigation = (searchQuery) => `
  <div class="navigation">
    <img class="navigation-logo searchProvider" src="./images/_logo.png" data-query=""/>
    <input class="navigation-search searchProvider searchConsumer" placeholder="🔍  Search ..." />
    <div class="TEMP searchConsumer"></div>
  </div>
`;

export default navigation;
