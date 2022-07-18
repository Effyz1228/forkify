import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJson } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookMarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}`);
    //destructuring
    let { recipe } = data.data;
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      title: recipe.title,
      sourceUrl: recipe.source_url,
    };
    if (state.bookMarks.some(bookMark => bookMark.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJson(`${API_URL}?search=${query}`);
    let { recipes } = data.data;
    state.search.page = 1;
    state.search.results = recipes.map(res => {
      return {
        id: res.id,
        image: res.image_url,
        publisher: res.publisher,
        title: res.title,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //10;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.map(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

const keepBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};
export const addBookMark = function (recipe) {
  //add recipe to bookmarks
  state.bookMarks.push(recipe);

  //mark the current recipe as bookmarked
  state.recipe.bookMarked = true;
  keepBookmarks();
};

export const deleteBookMark = function (id) {
  //delete recipe from the bookmark array
  const idx = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(idx, 1);

  //mark the recipe as false
  if (state.recipe.id === id) state.recipe.bookMarked = false;
  keepBookmarks();
};

//get data from localstorage
const init = function () {
  const storedData = localStorage.getItem('bookmarks');
  if (storedData) state.bookMarks = JSON.parse(storedData);
};
init();

//clean all localstorages
const cleanBookmarks = function () {
  localStorage.clear('bookmarks');
};
//cleanBookmarks();
