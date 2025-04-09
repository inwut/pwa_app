import { openDB } from "idb";

const DB_NAME = "pwa-app";
const DB_VERSION = 1;

export async function getIDB() {
  if (typeof indexedDB === "undefined") {
    return null;
  }
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("currentUser")) {
        db.createObjectStore("currentUser");
      }
      if (!db.objectStoreNames.contains("appData")) {
        db.createObjectStore("appData");
      }
      if (!db.objectStoreNames.contains("profile")) {
        db.createObjectStore("profile");
      }
      if (!db.objectStoreNames.contains("favorites")) {
        db.createObjectStore("favorites", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("recipes")) {
        db.createObjectStore("recipes", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("ingredients")) {
        db.createObjectStore("ingredients", { keyPath: "name" });
      }
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("deferredQueue")) {
        db.createObjectStore("deferredQueue", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

export async function saveToIDB(storeName, value, key = null) {
  const db = await getIDB();
  if (!db) return;
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  let finalValue = value;
  if (storeName === "recipes" || storeName === "favorites") {
    const existingData = await store.get(value.id);
    finalValue = mergeRecipeData(existingData, value);
  }

  if (storeName === "profile") {
    const existingData = await store.get(key);
    finalValue = mergeProfileData(existingData, value);
  }

  if (key !== null) {
    await store.put(finalValue, key);
  } else {
    await store.put(finalValue);
  }

  await tx.done;
}

export async function saveArrayToIDB(storeName, dataArray) {
  const db = await getIDB();
  if (!db) return;
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  for (const item of dataArray) {
    let newItem = item;
    if (storeName === "recipes" || storeName === "favorites") {
      let existingData = await store.get(item.id);
      newItem = mergeRecipeData(existingData, item);
    }
    await store.put(newItem);
  }

  await tx.done;
}

function mergeRecipeData(existingData, newItem) {
  if (existingData?.ingredients && !newItem.ingredients) {
    return { ...existingData, ...newItem };
  }
  return newItem;
}

function mergeProfileData(existingProfile, newProfile) {
  return {
    ...newProfile,
    recipes: newProfile.recipes.map((newRecipe) => {
      const existingRecipe = existingProfile.recipes.find(
        (r) => r.id === newRecipe.id,
      );
      return existingRecipe
        ? mergeRecipeData(existingRecipe, newRecipe)
        : newRecipe;
    }),
  };
}

export async function getFromIDB(storeName, key) {
  const db = await getIDB();
  if (!db) return null;
  return db.get(storeName, key);
}

export async function getAllFromIDB(storeName) {
  const db = await getIDB();
  if (!db) return [];
  return await db.getAll(storeName);
}

export async function getPagedArrayFromIDB(storeName, limit, offset = 0) {
  const db = await getIDB();
  if (!db) return [];
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  const allItems = await store.getAll();

  return allItems.slice(offset, offset + limit);
}

export async function deleteFromIDB(storeName, key) {
  const db = await getIDB();
  if (!db) return;
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  await store.delete(key);
  await tx.done;
}

export async function clearIDBStore(storeName) {
  const db = await getIDB();
  if (!db) return;
  await db.clear(storeName);
}
