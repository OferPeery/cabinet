import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const fsPromises = fs.promises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_TYPE = "json";

const getCollectionPath = (collectionName) =>
  path.join(__dirname, process.env.DB_PATH, `${collectionName}.${FILE_TYPE}`);

const writeEntities = (collectionName, entities) => {
  try {
    return fsPromises.writeFile(
      getCollectionPath(collectionName),
      JSON.stringify(entities)
    );
  } catch (error) {
    console.log("we have a problem:", error);
  }
};

const getAllEntities = async (collectionName) => {
  try {
    const data = await fsPromises.readFile(getCollectionPath(collectionName));
    return JSON.parse(data);
  } catch (error) {
    console.log("we have a problem:", error);
  }
};

const getEntity = async (collectionName, entityId) => {
  const allEntities = await getAllEntities(collectionName);
  const entity = allEntities.find((entity) => entity._id === entityId);

  return entity;
};

const addEntity = async (collectionName, entity) => {
  const entityToAdd = { _id: uuidv4(), ...entity };
  const entities = await getAllEntities(collectionName);
  const updatedCollection = [...entities, entityToAdd];

  await writeEntities(collectionName, updatedCollection);

  return entityToAdd;
};

const updateEntity = async (collectionName, newEntity) => {
  const allEntities = await getAllEntities(collectionName);
  const entityIndex = allEntities.findIndex(
    (anEntity) => anEntity._id === newEntity._id
  );

  if (entityIndex !== -1) {
    allEntities[entityIndex] = newEntity;
    await writeEntities(collectionName, allEntities);
  } else {
    console.log("update error");
    throw new Error(
      `Cannot update an entity with a no-existing ID:
      Entity with ID ${newEntity._id} was not found in collection ${collectionName}.`
    );
  }

  return newEntity;
};

const removeEntity = async (collectionName, entityId) => {
  const entityToRemove = await getEntity(collectionName, entityId);
  const allEntities = await getAllEntities(collectionName);
  const updatedCollection = allEntities.filter(
    (entity) => entity._id !== entityToRemove._id
  );

  await writeEntities(collectionName, updatedCollection);

  return entityToRemove;
};

export const createCollection = (collectionName) => {
  return Object.freeze({
    getAll: () => getAllEntities(collectionName),
    get: (entityId) => getEntity(collectionName, entityId),
    add: (newEntity) => addEntity(collectionName, newEntity),
    update: (updatedEntity) => updateEntity(collectionName, updatedEntity),
    remove: (entityId) => removeEntity(collectionName, entityId),
  });
};
