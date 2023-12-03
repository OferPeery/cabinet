import http from "./httpService";
import { SERVER_API_URL } from "./config.js";
import { getCurrentUserInCookie } from "./authService";

const BASE_URL = `${SERVER_API_URL}/users`;

export const getAllUsers = async () => {
  const res = await http.get(`${BASE_URL}`);
  return res.data;
};

export const getManyUsersById = async (userIds) => {
  const res = await http.get(`${BASE_URL}/many`, {
    withCredentials: true,
    params: { userIds },
  });

  return res.data;
};

export const getFollowers = async (userId) => {
  const res = await http.get(`${BASE_URL}/${userId}/followers`);
  return res.data;
};

export const getFollowees = async (userId) => {
  const res = await http.get(`${BASE_URL}/${userId}/followees`);
  return res.data;
};

export const fetchCurrentUser = async () => {
  const currentUserInCookie = getCurrentUserInCookie();

  if (!currentUserInCookie) {
    return;
  }

  const { _id } = currentUserInCookie;
  const res = await http.get(`${BASE_URL}/${_id}`);

  return res.data;
};

export const updateUser = async (userId, userPropertiesToUpdate) => {
  const res = await http.put(`${BASE_URL}/${userId}`, userPropertiesToUpdate);
  return res.data;
};

export const removeUser = async (userId) => {
  const res = await http.delete(`${BASE_URL}/${userId}`);
  return res.data;
};

export const followRequest = async (followeeId) => {
  return await http.post(`${BASE_URL}/follow`, { followeeId });
};

export const unfollowRequest = async (followeeId) => {
  return await http.post(`${BASE_URL}/unfollow`, { followeeId });
};
