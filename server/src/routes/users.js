import express from "express";
import Joi from "joi";
import {
  getAllUsers,
  getUserById,
  updateUser,
  removeUser,
} from "../services/users.js";
import {
  followUser,
  getFollowees,
  getFollowers,
  unfollowUser,
} from "../services/followings.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

const usersRouter = express.Router();
const uuidSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();
const validateIdParamSchema = validateSchema({
  params: Joi.object({
    id: uuidSchema,
  }),
});

usersRouter.get("/", async (_, res) => {
  const users = await getAllUsers();

  return res.send(users);
});

usersRouter.get(
  "/many",
  validateSchema({
    query: Joi.object({
      userIds: Joi.array().items(uuidSchema).required(),
    }),
  }),
  async (req, res) => {
    const { userIds } = req.query;
    const allUsers = await getAllUsers();
    const filteredUsers = allUsers.filter((user) => userIds.includes(user._id));

    return res.send(filteredUsers);
  }
);

usersRouter.get(
  "/:id",
  validateSchema({
    params: Joi.object({
      id: uuidSchema,
    }),
  }),
  async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).send(`User with ID ${id} wasn't found`);
    }

    return res.send(user);
  }
);

const minCharacters = 3;
const maxCharacters = 30;
const stringSchema = Joi.string().min(minCharacters).max(maxCharacters);
const nameSchema = stringSchema.pattern(/^[a-zA-Z \-\']+$/, "characters");

usersRouter.put(
  "/:id",
  validateSchema({
    params: Joi.object({
      id: uuidSchema,
    }),
    body: Joi.object({
      isDarkMode: Joi.boolean().optional(),
      firstName: nameSchema.optional(),
      lastName: nameSchema.optional(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional(),
      profileUrl: Joi.string().allow("").optional(),
      airline: nameSchema.optional(),
      position: nameSchema.optional(),
    }),
  }),
  async (req, res) => {
    const { _id, isAdmin } = req.user;
    const { id } = req.params;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send(`User with ID ${id} wasn't found`);
    }

    if (!isAdmin && _id !== id) {
      return res
        .status(403)
        .send(`You have no permission to change other user's details`);
    }

    const userPropertiesToUpdate = req.body;
    const updatedUserInCollection = await updateUser(
      id,
      userPropertiesToUpdate
    );

    return res.send(updatedUserInCollection);
  }
);

const changeFollowSchema = {
  body: Joi.object({
    followeeId: uuidSchema,
  }),
};

const changeFollowRequest = async (req, res, changeFollow, opName) => {
  const { _id: followerId } = req.user;
  const { followeeId } = req.body;

  if (followerId === followeeId) {
    return res.status(400).send(`A user cannot operate self ${opName}ing`);
  }

  const followee = await getUserById(followeeId);
  if (!followee) {
    return res.status(404).send(`User with ID ${followeeId} wasn't found`);
  }

  const following = await changeFollow(followerId, followeeId);

  if (!following) {
    return res
      .status(400)
      .send(`You're already ${opName}ing user with ID ${followeeId}`);
  }

  return res.status(200).send({});
};

usersRouter.post("/follow", validateSchema(changeFollowSchema), (req, res) =>
  changeFollowRequest(req, res, followUser, "follow")
);

usersRouter.post("/unfollow", validateSchema(changeFollowSchema), (req, res) =>
  changeFollowRequest(req, res, unfollowUser, "unfollow")
);

usersRouter.get("/:id/followers", validateIdParamSchema, async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);

  if (!user) {
    return res.status(404).send(`User with ID ${id} wasn't found`);
  }

  const followers = await getFollowers(user._id);

  return res.send(followers);
});

usersRouter.get("/:id/followees", validateIdParamSchema, async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);

  if (!user) {
    return res.status(404).send(`User with ID ${id} wasn't found`);
  }

  const followees = await getFollowees(user._id);

  return res.send(followees);
});

usersRouter.delete(
  "/:id",
  authenticateAdmin,
  validateSchema({
    params: Joi.object({
      id: uuidSchema,
    }),
  }),
  async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).send(`User with ID ${id} wasn't found`);
    }

    await removeUser(id);

    return res.send({});
  }
);

export default usersRouter;
