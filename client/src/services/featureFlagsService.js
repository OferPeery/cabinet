import http from "./httpService";
import { SERVER_API_URL } from "./config.js";

const BASE_URL = `${SERVER_API_URL}/feature-flags`;

export const getFeatureFlags = async () => {
  const res = await http.get(`${BASE_URL}/`);
  return res.data;
};

export const updateFeatureFlag = async (flagId, value) => {
  const res = await http.put(`${BASE_URL}/${flagId}`, { value });
  return res.data;
};

export const getFeatureFlagsValues = async () => {
  const res = await http.get(`${BASE_URL}/values`);
  return res.data;
};
