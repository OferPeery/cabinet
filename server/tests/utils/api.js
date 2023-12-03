import nodeFetch from "node-fetch";
import { generateCookie } from "./cookie";

const methods = ["get", "post", "put", "delete"];

const createFetchRequest = (url, method, additionalHeaders = {}) => {
  return Object.freeze({
    send: async (body) => {
      const headers = {
        "Content-Type": "application/json",
        ...additionalHeaders,
      };
      const response = await nodeFetch(
        `http://localhost:${process.env.SERVER_PORT}${url}`,
        {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers,
        }
      );

      let responseData;
      try {
        if (headers["Content-Type"] === "application/json") {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (error) {}
      return {
        status: response.status,
        headers: response.headers,
        body: responseData,
      };
    },

    set: (headerKey, value) =>
      createFetchRequest(url, method, {
        ...additionalHeaders,
        [headerKey]: value,
      }),
  });
};

const createMethods = () => {
  return Object.freeze(
    methods.reduce(
      (acc, method) => ({
        ...acc,
        [method]: (url) => createFetchRequest(url, method.toUpperCase()),
      }),
      {}
    )
  );
};

export const createApi = (user) => {
  let methods = createMethods();

  if (user) {
    const cookie = generateCookie(user);
    methods = Object.fromEntries(
      Object.entries(methods).map(([method, func]) => [
        method,
        (url) => func(url).set("Cookie", cookie),
      ])
    );
  }

  return Object.freeze({
    registerNewUser: (user) => methods.post("/api/auth/register").send(user),

    loginUser: (user) => methods.post("/api/auth/login").send(user),

    logoutUser: () => methods.post("/api/auth/logout").send(),

    getUsers: () => methods.get("/api/users").send(),

    getUser: (userId) => methods.get(`/api/users/${userId}`).send(),

    getManyUsers: (userIds) =>
      methods
        .get(
          `/api/users/many?${userIds.map((id) => `userIds[]=${id}`).join("&")}`
        )
        .send(),

    updateUser: (userId, details) =>
      methods.put(`/api/users/${userId}`).send(details),

    followUser: (followeeId) =>
      methods.post("/api/users/follow").send({
        followeeId,
      }),

    unfollowUser: (followeeId) =>
      methods.post("/api/users/unfollow").send({
        followeeId,
      }),

    getFollowers: (userId) =>
      methods.get(`/api/users/${userId}/followers`).send(),

    getFollowees: (userId) =>
      methods.get(`/api/users/${userId}/followees`).send(),

    removeUser: (userId) => methods.delete(`/api/users/${userId}`).send(),

    getFeatureFlags: () => methods.get("/api/feature-flags").send(),

    updateFeatureFlag: (flagId, value) =>
      methods.put(`/api/feature-flags/${flagId}`).send({ value }),

    getFeatureFlagsValues: () =>
      methods.get("/api/feature-flags/values").send(),

    getFeedPosts: (userId) =>
      methods.get(`/api/posts/feed?userId=${userId}`).send(),

    createPost: (post) => methods.post("/api/posts").send(post),

    likePost: (postId) => methods.post(`/api/posts/${postId}/like`).send(),

    unlikePost: (postId) => methods.post(`/api/posts/${postId}/unlike`).send(),

    getActivityLog: () => methods.get("/api/activity-log").send(),

    getReadme: () =>
      createFetchRequest("/readme.html", "GET", {
        "Content-Type": "text/html",
      }).send(),

    getApp: () =>
      createFetchRequest("/", "GET", {
        "Content-Type": "text/html",
      }).send(),
  });
};
