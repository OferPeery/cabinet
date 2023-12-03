import dateFormat from "dateFormat";
import { createCollection } from "../db/persist.js";
import { getFollowees } from "./followings.js";
import { removeImage } from "./imageUploader.js";
import { getUserById } from "./users.js";

const COLLECTION_NAME = "posts";
const collection = createCollection(COLLECTION_NAME);

export const getAllPosts = () => collection.getAll();

export const getPostById = (postId) => collection.get(postId);

export const getPostsCreatedBy = async (userId) => {
  const posts = await getAllPosts();

  return posts.filter((post) => post.creatorId === userId);
};

export const getPostsOfFollowees = async (followeeIds) => {
  const posts = [];

  for (const id of followeeIds) {
    const followeePosts = await getPostsCreatedBy(id);
    posts.push(...followeePosts);
  }

  return posts;
};

export const aggregatePost = async (post) => {
  const creatorUser = await getUserById(post.creatorId);
  const likedByUsers = [];

  for (const userId of post.likedBy) {
    const user = await getUserById(userId);
    likedByUsers.push(user);
  }

  return {
    ...post,
    creatorUsername: creatorUser.username,
    creatorProfileUrl: creatorUser.profileUrl,
    creationDate: dateFormat(post.timestamp, "fullDate"),
    creationTime: dateFormat(post.timestamp, "isoTime"),
    likesAmount: post.likedBy.length,
    likedByUsernames: likedByUsers.map(({ username }) => username),
  };
};

export const getAggregatedPostsOfUserIds = async (userIds) => {
  const posts = await getPostsOfFollowees(userIds);

  const aggregatedPosts = [];

  for (const post of posts) {
    const aggregatedPost = await aggregatePost(post);
    aggregatedPosts.push(aggregatedPost);
  }

  return aggregatedPosts;
};

export const getFeedByUserId = async (userId) => {
  const followees = await getFollowees(userId);
  const userIdsList = [...followees, userId];
  const feed = await getAggregatedPostsOfUserIds(userIdsList);

  feed.sort((post1, post2) => (post1.timestamp > post2.timestamp ? -1 : 1));

  return feed;
};

export const addNewPost = (newPost) => {
  const postToAdd = {
    ...newPost,
    timestamp: Date.now(),
    likedBy: [],
  };

  return collection.add(postToAdd);
};

export const CHANGE_LIKE_OPTIONS = ["like", "unlike"];

export class DoubleRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "DoubleRequestError";
  }
}

const validateLikeChangeParams = async (changeLike, likerId, postId) => {
  if (!CHANGE_LIKE_OPTIONS.includes(changeLike)) {
    throw new Error(`Change like option ${changeLike} is invalid`);
  }

  const user = await getUserById(likerId);
  if (!user) {
    throw new Error(`User with ID ${userId} was not found`);
  }

  const post = await getPostById(postId);
  if (!post) {
    throw new Error(`Post with ID ${postId} was not found`);
  }
};

const validateChangeLegal = (changeLike, likesList, likerId, postId) => {
  let alreadyHolds = likesList.includes(likerId);

  if (changeLike === "unlike") {
    alreadyHolds = !alreadyHolds;
  }

  if (alreadyHolds) {
    throw new DoubleRequestError(
      `User with ID ${likerId} already ${changeLike}s post with ID ${postId}`
    );
  }
};

export const tryChangeLikePost = async (changeLike, likerId, postId) => {
  await validateLikeChangeParams(changeLike, likerId, postId);
  const postToChangeLike = await getPostById(postId);

  validateChangeLegal(changeLike, postToChangeLike.likedBy, likerId, postId);

  if (changeLike === "like") {
    postToChangeLike.likedBy.push(likerId);
  } else {
    postToChangeLike.likedBy = postToChangeLike.likedBy.filter(
      (id) => id !== likerId
    );
  }

  return collection.update(postToChangeLike);
};

export const removePost = (postId) => collection.remove(postId);

export const removePostsOfUser = async (userId) => {
  const posts = await getPostsCreatedBy(userId);
  const images = posts.map(({ imageUrl }) => imageUrl).filter(Boolean);

  for (const image of images) {
    await removeImage(image);
  }

  for (const post of posts) {
    await removePost(post._id);
  }
};

export const removeLikesMadeBy = async (userId) => {
  const posts = await getAllPosts();

  for (const post of posts) {
    await collection.update({
      ...post,
      likedBy: post.likedBy.filter((id) => id !== userId),
    });
  }
};
