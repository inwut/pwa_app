import { openDB } from "idb";

const DB_NAME = "pwa-app";
const DB_VERSION = 1;

let idbInstance = null;

async function getIDB() {
  if (!("indexedDB" in window)) {
    return null;
  }
  if (!idbInstance) {
    idbInstance = await openDB(DB_NAME, DB_VERSION, {
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
      },
    });
  }
  return idbInstance;
}

export async function saveToIDB(storeName, value, key = null) {
  const db = await getIDB();
  if (!db) return;

  if (key !== null) {
    await db.put(storeName, value, key);
  } else {
    await db.put(storeName, value);
  }
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
      if (existingData && existingData.ingredients && !item.ingredients) {
        newItem = { ...existingData, ...item };
      }
    }
    await store.put(newItem);
  }

  await tx.done;
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

export async function clearIDBStore(storeName) {
  const db = await getIDB();
  if (!db) return;
  await db.clear(storeName);
}
