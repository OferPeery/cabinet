import express from "express";
import {
  generateAccessToken,
  addPassword,
  validatePassword,
} from "../services/auth.js";
import { getUserByUserName, addUser } from "../services/users.js";
import {
  authenticateToken,
  COOKIE_NAME,
} from "../middleware/authenticateToken.js";
import { logActivity } from "../services/activity-log.js";
import { validateSchema } from "../middleware/validateSchema.js";
import Joi from "joi";

const authRouter = express.Router();

const daysToMiliseconds = (days) => {
  return days * 24 * 60 * 60 * 1000;
};

const minutesToMiliseconds = (minutes) => {
  return minutes * 60 * 1000;
};

const sendNewCookie = (res, statusCode, user, isRememberMe, payloadToSend) => {
  const expireInMiliseconds = isRememberMe
    ? daysToMiliseconds(10) // 10 days
    : minutesToMiliseconds(30); // 30 minutes
  const maxAgeSetting = { maxAge: expireInMiliseconds };
  const accessToken = generateAccessToken(user, expireInMiliseconds);

  res.cookie(COOKIE_NAME, accessToken, maxAgeSetting);

  return res.status(statusCode).send(payloadToSend);
};
// Schemas //
const minCharacters = 3;
const maxCharacters = 30;
const stringSchema = Joi.string().min(minCharacters).max(maxCharacters);

const nameSchema = stringSchema
  .pattern(/^[a-zA-Z \-\']+$/, "characters")
  .messages({
    "string.pattern.name":
      "{{#label}} must only contain english letters, space or dash",
  });

const firstNameSchema = nameSchema.label("First Name").required();

const lastNameSchema = nameSchema.label("Last Name").required();

const emailSchema = Joi.string()
  .label("Email")
  .required()
  .email({ tlds: { allow: false } });

const usernameSchema = stringSchema.label("Username").required().alphanum();

const passwordSchema = stringSchema
  .label("Password")
  .required()
  .pattern(/^[a-zA-Z0-9!@#$%^&*]+$/, "characters")
  .messages({
    "string.pattern.name":
      "{{#label}} must only contain characters, digits, and special characters",
  });

// POST - register //
authRouter.post(
  "/register",
  validateSchema({
    body: Joi.object({
      firstName: firstNameSchema,
      lastName: lastNameSchema,
      username: usernameSchema,
      email: emailSchema,
      password: passwordSchema,
      isRememberMe: Joi.boolean().required(),
    }),
  }),
  async (req, res) => {
    const { isRememberMe, password, ...newUser } = req.body;

    const user = await getUserByUserName(newUser.username);
    if (user) {
      return res.status(400).send({
        message: `Username '${newUser.username}' isn't available`,
        errorType: "username-unavailable",
      });
    }

    try {
      const addedUser = await addUser(newUser);

      await addPassword(addedUser._id, password);
      await logActivity({
        username: addedUser.username,
        activityType: "register",
      });

      return sendNewCookie(res, 201, addedUser, isRememberMe, addedUser);
    } catch {
      res.status(500).send("Something went wrong. Try again");
    }
  }
);

// POST - login //
authRouter.post(
  "/login",
  validateSchema({
    body: Joi.object({
      username: usernameSchema,
      password: passwordSchema,
      isRememberMe: Joi.boolean().required(),
    }),
  }),
  async (req, res) => {
    const { isRememberMe, username, password } = req.body;
    const user = await getUserByUserName(username);

    // Security best practice - don't expose if the username or the password is incorrect
    const returnInvalidLogin = () => {
      return res.status(401).send({
        message: `Username or password is incorrect.`,
        errorType: "login",
      });
    };

    if (!user) {
      return returnInvalidLogin();
    }

    try {
      const isPasswordValid = await validatePassword(user._id, password);

      if (!isPasswordValid) {
        return returnInvalidLogin();
      }
    } catch {
      return res.status(500).send("Something went wrong. Try again");
    }

    await logActivity({ username, activityType: "login" });

    return sendNewCookie(res, 200, user, isRememberMe, user);
  }
);

// POST - logout //
authRouter.post("/logout", authenticateToken, async (req, res) => {
  const { username } = req.user;

  await logActivity({ username, activityType: "logout" });

  return res.send("Logged-out successfully");
});

export default authRouter;
