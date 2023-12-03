import axios from "axios";
import Cookies from "js-cookie";

const WITH_CREDENTIALS = { withCredentials: true };
const COOKIE_NAME = "access_token";

axios.interceptors.response.use(null, (error) => {
  console.log("An error has occured:", error);

  // If user is not authorized (cookie expired / invalid / user doesn't exist) - redirect to login page
  if (
    error.response.status === 401 &&
    error.response.data?.errorType !== "login"
  ) {
    if (Cookies.get(COOKIE_NAME)) {
      Cookies.remove(COOKIE_NAME);
    }

    window.location = "/login";
  }

  if (error.response.status === 403) {
    window.location = "/home";
  }

  return Promise.reject(error);
});

const http = {
  get: (url, options = WITH_CREDENTIALS) => axios.get(url, options),
  post: (url, body, options = WITH_CREDENTIALS) =>
    axios.post(url, body, options),
  put: (url, body, options = WITH_CREDENTIALS) => axios.put(url, body, options),
  delete: (url, options = WITH_CREDENTIALS) => axios.delete(url, options),
};

export default http;
