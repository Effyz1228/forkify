import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
import { getJson, sendJson } from './helpers.js';

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

const createRecipeObject = function (data) {
  //destructuring
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    //trick to conditionally add properties to object
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

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

export const uploadRecipe = async function (newRecipe) {
  //get the useful data from ingredients and turn them into the form as the API used
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error('Wrong format, please try again!');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //create the recipe object
    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      ingredients,
    };
    const data = await sendJson(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
