import View from './View.js';
//use parcel to get icons
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandleClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      //convert gotopage to a number from a string
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.page;

    //at first page,only show after button
    if (currPage === 1 && currPage < totalPages)
      return this._generatePageBtns('next', 'right', currPage + 1);

    //at last page,only show before button
    if (currPage === totalPages && totalPages > 1)
      return this._generatePageBtns('prev', 'left', currPage - 1);

    //in between,show two buttons
    if (currPage < totalPages) {
      const before = this._generatePageBtns('prev', 'left', currPage - 1);
      const after = this._generatePageBtns('next', 'right', currPage + 1);
      return before + after;
    }

    //only one page,show nothing
    return '';
  }

  _generatePageBtns(directions, arrow, page) {
    return `
        <button data-goto="${page}" class="btn--inline pagination__btn--${directions}">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-${arrow}"></use>
            </svg>
            <span>Page ${page}</span>
         </button>`;
  }
}

export default new PaginationView();
