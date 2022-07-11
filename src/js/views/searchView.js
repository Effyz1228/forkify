class SearchView {
  #parentElement = document.querySelector('.search');

  #cleanup() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#cleanup();
    return query;
  }

  addHandleSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
