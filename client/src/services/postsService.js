import http from "./httpService";
import { SERVER_API_URL } from "./config.js";

const BASE_URL = `${SERVER_API_URL}/posts`;

export const getFeedByUserId = async (userId) => {
  const res = await http.get(`${BASE_URL}/feed?userId=${userId}`);
  return res.data;
};

export const addNewPost = async (post) => {
  const res = await http.post(`${BASE_URL}`, post);
  return res.data;
};

export const changeLikePost = async (postId, isLike) => {
  const res = await http.post(
    `${BASE_URL}/${postId}/${isLike ? "like" : "unlike"}`,
    {}
  );

  return res.data;
};
