import { DB_CONFIG } from "@static/observation-create";
import setupIndexedDB from "use-indexeddb";

import notification from "./notification";

export const setupDB = () => {
  if (window.indexedDB) {
    setupIndexedDB(DB_CONFIG)
      .then(() => console.debug("IndexedDB Connected"))
      .catch(notification);
  } else {
    notification("IndexedDB not supported in private window!");
  }
};
