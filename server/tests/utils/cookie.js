import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  const { _id, username, isAdmin } = user;
  const infoToSerialize = { _id, username, isAdmin };

  return jwt.sign(infoToSerialize, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${60_000}ms`,
  });
};

export const generateCookie = (user) =>
  `access_token=${generateAccessToken(user)}`;
