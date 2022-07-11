import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJson } from './helpers.js';

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}/${id}`);
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
    console.error(err);
  }
};
