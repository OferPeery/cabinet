import http from "./httpService";
import { SERVER_URL } from "./config.js";

const BASE_URL = `${SERVER_URL}/images`;

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const res = await http.post(`${BASE_URL}/upload`, formData);

  return res.data;
};

export const getServerImageUrl = (imageUrl) => `${BASE_URL}/${imageUrl}`;

export const imageFileFormats = "image/png, image/gif, image/jpeg, image/jpg";
