import { createCollection } from "../db/persist.js";
import { removePasswordOfUser } from "./auth.js";
import { removeFollowingsOfUser } from "./followings.js";
import { removeImage } from "./imageUploader.js";
import { removePostsOfUser, removeLikesMadeBy } from "./posts.js";

const COLLECTION_NAME = "users";
const collection = createCollection(COLLECTION_NAME);

export const getAllUsers = () => collection.getAll();

export const getUserById = (id) => collection.get(id);

export const getUserByUserName = async (username) => {
  const users = await getAllUsers();
  const user = users.find((user) => user.username === username);

  return user;
};

export const addUser = (newUser) => {
  const userToAdd = {
    isAdmin: false,
    isDarkMode: false,
    profileUrl: "",
    airline: "",
    position: "",
    ...newUser,
  };

  return collection.add(userToAdd);
};

export const updateUser = async (id, userPropertiesToUpdate) => {
  const prevUserDetails = await getUserById(id);
  const updatedUser = { ...prevUserDetails, ...userPropertiesToUpdate };

  return collection.update(updatedUser);
};

const removeProfilePictureOfUser = async (id) => {
  const user = await getUserById(id);
  if (user.profileUrl) {
    await removeImage(user.profileUrl);
  }
};

export const removeUser = async (id) => {
  await removePasswordOfUser(id);
  await removeProfilePictureOfUser(id);
  await removePostsOfUser(id);
  await removeFollowingsOfUser(id);
  await removeLikesMadeBy(id);
  return collection.remove(id);
  // We should not remove the user from the activity log
};
