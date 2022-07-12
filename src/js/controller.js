import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

//polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //get search query
    const query = searchView.getQuery();
    if (!query) return;

    //render search query
    await model.loadSearchResults(query);
    //show results
    resultsView.render(model.getSearchResultsPage(2));
    console.log(model.getSearchResultsPage());
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandleSearch(controlSearchResults);
};

init();
