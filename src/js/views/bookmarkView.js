import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage =
    'No recipe has been bookmarked. Please find one you like and bookmark it.';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookmarkView();
