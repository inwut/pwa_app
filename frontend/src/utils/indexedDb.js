import { openDB } from "idb";

const DB_NAME = "pwa-app";
const DB_VERSION = 1;

let dbInstance = null;

async function getIDB(storeName) {
  if (!("indexedDB" in window)) {
    return null;
  }
  if (!dbInstance) {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      },
    });
  }
  return dbInstance;
}

export async function saveToIDB(storeName, key, value) {
  const db = await getIDB(storeName);
  if (!db) return;
  await db.put(storeName, value, key);
}

export async function getFromIDB(storeName, key) {
  const db = await getIDB(storeName);
  if (!db) return;
  return db.get(storeName, key);
}

export async function deleteFromIDB(storeName, key) {
  const db = await getIDB(storeName);
  if (!db) return;
  await db.delete(storeName, key);
}

export async function clearIDBStore(storeName) {
  const db = await getIDB(storeName);
  if (!db) return;
  await db.clear(storeName);
}
