import {
  clearIDBStore,
  getFromIDB,
  saveArrayToIDB,
  saveToIDB,
} from "./indexedDb.js";
import api from "../common/api.js";

const isFirstVisit = async () => {
  const flag = await getFromIDB("appData", "firstVisit");
  if (!flag) {
    await saveToIDB("appData", true, "firstVisit");
    return true;
  }
  return false;
};

const fetchRecipesFullInfo = async (recipes) => {
  const recipeIds = recipes.map((recipe) => recipe.id);
  const recipesDetails = await Promise.all(
    recipeIds.map((id) => api.get(`/recipes/${id}`)),
  );
  return recipesDetails.map((response) => response.data.recipe);
};

export const cacheInitialData = async (userId) => {
  const shouldFetch = await isFirstVisit();

  if (!shouldFetch) return;

  try {
    const favorites = await api.get("/recipes/liked");
    const favoritesWithFullInfo = await fetchRecipesFullInfo(favorites.data);
    await saveArrayToIDB("favorites", favoritesWithFullInfo);

    const profile = await api.get(`/users/${userId}`);
    profile.recipes = await fetchRecipesFullInfo(profile.data.user.recipes);
    await saveToIDB("profile", profile, "me");
  } catch (error) {
    console.error(error);
  }
};

export const clearInitialData = async () => {
  await Promise.all([clearIDBStore("favorites"), clearIDBStore("profile")]);
};
