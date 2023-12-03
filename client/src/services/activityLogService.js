import http from "./httpService";
import { SERVER_API_URL } from "./config.js";

const BASE_URL = `${SERVER_API_URL}/activity-log`;

export const getActivityLog = async () => {
  const res = await http.get(`${BASE_URL}/`);

  return res.data;
};
