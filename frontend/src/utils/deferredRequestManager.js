import { saveToIDB, getAllFromIDB, deleteFromIDB } from "./indexedDb.js";

export const addToDeferredQueue = async (entry) => {
  await saveToIDB("deferredQueue", entry);
};

export const replayDeferredRequests = async () => {
  const allRequests = await getAllFromIDB("deferredQueue");

  for (const req of allRequests) {
    try {
      await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        credentials: "include",
      });
      await deleteFromIDB("deferredQueue", req.id);
    } catch (error) {
      console.warn("Retry failed for:", req.url);
    }
  }
};
