import { getIDB } from "./indexedDb.js";

export const addToDeferredQueue = async (entry) => {
  const db = await getIDB();
  await db.add("deferredQueue", entry);
};

export const replayDeferredRequests = async () => {
  const db = await getIDB();
  const allRequests = await db.getAll("deferredQueue");

  for (const req of allRequests) {
    try {
      await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        credentials: "include",
      });
      await db.delete("deferredQueue", req.id);
    } catch (error) {
      console.warn("Retry failed for:", req.url);
    }
  }
};
