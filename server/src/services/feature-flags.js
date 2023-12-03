import { createCollection } from "../db/persist.js";

const COLLECTION_NAME = "feature-flags";
const collection = createCollection(COLLECTION_NAME);

export const getFeatureFlags = () => collection.getAll();

export const getFeatureFlagsValues = async () => {
  const flags = await collection.getAll();

  return flags.reduce(
    (flags, { key, value }) => ({ ...flags, [key]: value }),
    {}
  );
};

export const getFeatureFlag = (flagId) => collection.get(flagId);

export const updateFeatureFlag = async (flagId, newValue) => {
  const flag = await collection.get(flagId);

  if (!flag) {
    return;
  }

  return collection.update({ ...flag, value: newValue });
};
