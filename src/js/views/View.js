import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    if (!render) return this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup()
    );
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkups = this._generateMarkup();
    //newMarkups is just a string, very hard to compare
    //a trick to solve this problem
    const newDOM = document.createRange().createContextualFragment(newMarkups);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.map((newEl, i) => {
      const curEl = currElements[i];

      //update changed Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log(newEl.firstChild?.nodeValue.trim());
        curEl.innerHTML = newEl.innerHTML;
      }
      //update changed attribute (dataset on btn)
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).map(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
