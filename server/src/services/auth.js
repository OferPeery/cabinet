import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createCollection } from "../db/persist.js";

const COLLECTION_NAME = "passwords";
const collection = createCollection(COLLECTION_NAME);

export const addPassword = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  collection.add({ userId, password: hashedPassword });
};

export const removePasswordOfUser = async (userId) => {
  const auths = await collection.getAll();
  const auth = auths.find((auth) => auth.userId === userId);

  if (!auth) {
    return;
  }

  await collection.remove(auth._id);
};

export const validatePassword = async (userId, password) => {
  const auths = await collection.getAll();
  const authLogin = auths.find((auth) => auth.userId === userId);

  if (!authLogin) {
    return false;
  }

  return await bcrypt.compare(password, authLogin.password);
};

export const getAccessTokenSecret = () => `${process.env.ACCESS_TOKEN_SECRET}`;

export const generateAccessToken = (user, expireInMiliseconds) => {
  const { _id, username, isAdmin } = user;
  const infoToSerialize = { _id, username, isAdmin };
  const accessTokenSecret = getAccessTokenSecret();
  const expirationSetting = { expiresIn: `${expireInMiliseconds}ms` };

  return jwt.sign(infoToSerialize, accessTokenSecret, expirationSetting);
};
