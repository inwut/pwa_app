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
export const cacheInitialData = async (userId) => {
  const shouldFetch = await isFirstVisit();

  if (!shouldFetch) return;

  try {
    const favouriteRecipes = await api.get("/recipes/liked");
    const recipeIds = favouriteRecipes.data.map((recipe) => recipe.id);

    const recipeDetails = await Promise.all(
      recipeIds.map((id) => api.get(`/recipes/${id}`)),
    );

    await saveArrayToIDB(
      "favorites",
      recipeDetails.map((response) => response.data.recipe),
    );

    const profile = await api.get(`/users/${userId}`);
    await saveToIDB("profile", profile.data.user, "me");
  } catch (error) {
    console.error(error);
  }
};

export const clearInitialData = async () => {
  await Promise.all([clearIDBStore("favorites"), clearIDBStore("profile")]);
};
