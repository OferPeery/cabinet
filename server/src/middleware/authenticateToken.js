import jwt from "jsonwebtoken";
import { getAccessTokenSecret } from "../services/auth.js";
import { getUserByUserName } from "../services/users.js";

export const COOKIE_NAME = "access_token";

export const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies[COOKIE_NAME];

  if (!accessToken) {
    return res.status(401).send({
      message: `Cookie with access token was not provided`,
      errorType: `cookie-missing`,
    });
  }

  try {
    const tokenInfo = jwt.verify(accessToken, getAccessTokenSecret());
    const user = await getUserByUserName(tokenInfo.username);

    if (!user) {
      throw new Error();
    }

    req.user = user;
  } catch {
    return res
      .status(401)
      .send({ message: `Cookie is invalid.`, errorType: "cookie-invalid" });
  }

  next();
};
