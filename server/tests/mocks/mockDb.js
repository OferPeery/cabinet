import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_TYPE = "json";
const folderPath = [__dirname, "..", "..", "src", "db", process.env.DB_PATH];

const getCollectionPath = (collectionName) =>
  path.join(...folderPath, `${collectionName}.${FILE_TYPE}`);

const collectionNames = [
  "activity-log",
  "feature-flags",
  "followings",
  "passwords",
  "posts",
  "users",
];

const createMockedCollections = () => {
  fs.mkdirSync(path.join(...folderPath), { recursive: true });

  collectionNames.forEach((name) =>
    fs.writeFileSync(getCollectionPath(name), JSON.stringify([]))
  );
};

const clearMockedCollections = () => {
  fs.rmSync(path.join(...folderPath), {
    recursive: true,
    force: true,
  });
};

const readCollection = (name) => {
  const readData = fs.readFileSync(getCollectionPath(name));
  return JSON.parse(readData);
};

const insertCollection = (name, value) => {
  const entities = readCollection(name);
  fs.writeFileSync(
    getCollectionPath(name),
    JSON.stringify([...entities, value])
  );
};

export const createMockDb = () => {
  let initialized = false;

  return Object.freeze({
    initialize: () => {
      createMockedCollections();
      initialized = true;
    },
    insert: (name, value) => {
      if (!initialized) {
        throw new Error("MockDb must be initialized before inserting data");
      }
      insertCollection(name, value);
    },
    destroy: () => {
      if (!initialized) {
        throw new Error("MockDb must be initialized before destroying data");
      }
      clearMockedCollections();
    },
  });
};
