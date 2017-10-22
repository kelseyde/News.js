var app = function() {

  var apiKey = "a87d02c3a93144409bb4e9b6becb566c";

  var applyFilter = function(sources) {
    var filterSelect = document.getElementById("filters");
    filterSelect.addEventListener("change", function() {
      var selectedFilter = filterSelect.value;
      var filteredSources = sources.filter(function(source) {
        return source.category === selectedFilter;
      });
      populateSourcesDropdown(filteredSources);
    });
  }

  var populateFiltersDropdown = function(sources) {
    var filterSelect = document.getElementById("filters");
    while (filterSelect.firstChild) { filterSelect.removeChild(filterSelect.firstChild) }
    var filtersWithDuplicates = sources.map(function(source) {
      return source.category;
    })
    var filters = filtersWithDuplicates.filter(function(category, currentIndex) {
      var firstIndex = filtersWithDuplicates.indexOf(category);
      return firstIndex === currentIndex;
    });
    filters.forEach(function(filter) {
      var option = document.createElement("option");
      option.innerText = filter;
      filterSelect.appendChild(option);
    });
    applyFilter(sources, filters);
  }

  var displayArticles = function(articles, selectedSource) {

    var ul = document.getElementById("articles");
    while (ul.firstChild) { ul.removeChild(ul.firstChild) }
    var heading = document.getElementById("source-name");
    heading.innerText = selectedSource.name;
    var url = document.getElementById("source-url");
    url.href = selectedSource.url;
    url.innerText = selectedSource.url;

    articles.articles.forEach(function(article) {
      var articleListItem = document.createElement("li");
      var articleDiv = document.createElement("div");
      articleDiv.id = "article-container";
      var articleTitle = document.createElement("h3");
      articleTitle.innerText = article.title;
      var articleImage = document.createElement("img");
      articleImage.src = article.urlToImage;
      var articleDescription = document.createElement("p");
      articleDescription.innerText = article.description;
      var articleURL = document.createElement("a");
      articleURL.href = article.url;
      articleURL.innerText = "Read more";

      ul.appendChild(articleListItem);
      articleListItem.appendChild(articleDiv);
      articleDiv.appendChild(articleTitle);
      articleDiv.appendChild(articleImage);
      articleDiv.appendChild(articleDescription);
      articleDiv.appendChild(articleURL);
    })
  }

  var getSourceArticles = function(sources, selectedSource) {
    var request = new XMLHttpRequest();
    var url = "https://newsapi.org/v1/articles?source="
              + selectedSource.id
              + "&apiKey="
              + apiKey;
    request.open("GET", url);
    request.addEventListener("load", function() {
      var articles = JSON.parse(this.responseText);
      console.log(articles);
      displayArticles(articles, selectedSource);
    });
    request.send();
  }

  var getSelectedSource = function(sources) {
    var select = document.getElementById("sources");
    select.addEventListener("change", function() {
      var selectedSourceName = select.value;
      var selectedSource = sources.find(function(source) {
        return source.name === selectedSourceName;
      });
      getSourceArticles(sources, selectedSource);
    });
  }

  var populateSourcesDropdown = function(sources) {
    var select = document.getElementById("sources");
    while (select.firstChild) { select.removeChild(select.firstChild) }
    var sourceNamesArray = sources.map(function(source) {
      return source.name;
    });
    sourceNamesArray.forEach(function(sourceName) {
      var option = document.createElement("option");
      option.innerText = sourceName;
      select.appendChild(option);
    });
    getSelectedSource(sources);
  }

  var getSources = function(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener("load", function() {
      sources = JSON.parse(this.responseText).sources;
      console.log(sources);
      populateSourcesDropdown(sources);
      populateFiltersDropdown(sources);
    });
    request.send();
  }

  getSources("https://newsapi.org/v1/sources?language=en");

}

window.addEventListener("load", app);
