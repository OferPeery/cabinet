import { createCollection } from "../db/persist.js";

const COLLECTION_NAME = "activity-log";
const collection = createCollection(COLLECTION_NAME);

export const logActivity = (activity) =>
  collection.add({ ...activity, timestamp: Date.now() });

export const getActivityLog = () => collection.getAll();
