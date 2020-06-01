import { IndexedDBConfig } from "use-indexeddb/src/interfaces";

export const STORE = {
  ASSETS: "assets",
  PENDING_OBSERVATIONS: "pending-observations"
};

export const DB_CONFIG: IndexedDBConfig = {
  databaseName: "ibp",
  version: 3,
  stores: [
    {
      name: STORE.ASSETS,
      id: { keyPath: "id", autoIncrement: true },
      indices: [
        { name: "hashKey", keyPath: "hashKey", options: { unique: true } },
        { name: "fileName", keyPath: "fileName" },
        { name: "path", keyPath: "path" },
        { name: "type", keyPath: "type" },
        { name: "license", keyPath: "license" },
        { name: "status", keyPath: "status" },
        { name: "caption", keyPath: "caption" },
        { name: "ratings", keyPath: "ratings" },
        { name: "latitude", keyPath: "latitude" },
        { name: "longitude", keyPath: "longitude" },
        { name: "blob", keyPath: "blob" },
        { name: "isUsed", keyPath: "isUsed" },
        { name: "dateCreated", keyPath: "dateCreated" },
        { name: "dateUploaded", keyPath: "dateUploaded" }
      ]
    },
    {
      name: STORE.PENDING_OBSERVATIONS,
      id: { keyPath: "id", autoIncrement: true },
      indices: [{ name: "data", keyPath: "data" }]
    }
  ]
};

export const ASSET_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio"
};

export const LOCAL_ASSET_PREFIX = "ibpmu-";
