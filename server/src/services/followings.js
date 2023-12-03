import { createCollection } from "../db/persist.js";

const COLLECTION_NAME = "followings";
const collection = createCollection(COLLECTION_NAME);

const getFollowing = async (followerId, followeeId) => {
  const followings = await collection.getAll();

  return followings.find(
    (following) =>
      following.followerId === followerId && following.followeeId === followeeId
  );
};

export const followUser = async (followerId, followeeId) => {
  const following = await getFollowing(followerId, followeeId);

  if (following) {
    return;
  }

  const followingToAdd = {
    followerId,
    followeeId,
  };

  return collection.add(followingToAdd);
};

export const unfollowUser = async (followerId, followeeId) => {
  const following = await getFollowing(followerId, followeeId);

  if (following) {
    return collection.remove(following._id);
  }
};

export const getFollowers = async (followeeId) => {
  const followings = await collection.getAll();

  return followings
    .filter((following) => following.followeeId === followeeId)
    .map(({ followerId }) => followerId);
};

export const getFollowees = async (followerId) => {
  const followings = await collection.getAll();

  return followings
    .filter((following) => following.followerId === followerId)
    .map(({ followeeId }) => followeeId);
};

export const removeFollowingsOfUser = async (userId) => {
  const followings = await collection.getAll();
  const userFollowings = followings.filter(
    (following) =>
      following.followerId === userId || following.followeeId === userId
  );

  for (const following of userFollowings) {
    await collection.remove(following._id);
  }
};
