import http from "./httpService";
import { SERVER_API_URL } from "./config.js";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const BASE_URL = `${SERVER_API_URL}/auth`;
const COOKIE_NAME = "access_token";

const getAccessToken = () => Cookies.get(COOKIE_NAME);

export const getCurrentUserInCookie = () => {
  try {
    const accessToken = getAccessToken();
    const currentUserInCookie = jwtDecode(accessToken);

    return currentUserInCookie;
  } catch {
    return null;
  }
};

export const loginToApp = async (userInfo) => {
  const res = await http.post(`${BASE_URL}/login`, userInfo);

  return res.data;
};

export const registerToApp = async (userInfo) => {
  const res = await http.post(`${BASE_URL}/register`, userInfo);

  return res.data;
};

export const logoutApp = async () => {
  const res = await http.post(`${BASE_URL}/logout`, {});

  Cookies.remove(COOKIE_NAME);

  return res;
};
