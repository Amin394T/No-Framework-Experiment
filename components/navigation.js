import "../styles/navigation.css";

const navigation = (searchQuery) => `
  <div class="navigation">
    <img class="navigation-logo searchProvider" src="./images/_logo.png" data-query=""/>
    <input class="navigation-search searchProvider searchConsumer" placeholder="🔍  Search ..." value="${searchQuery}" />
  </div>
`;

export default navigation;
