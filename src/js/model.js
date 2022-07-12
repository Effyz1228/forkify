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
    //console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJson(`${API_URL}?search=${query}`);
    let { recipes } = data.data;

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
