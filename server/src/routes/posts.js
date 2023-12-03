import express from "express";
import Joi from "joi";
import { getUserById } from "../services/users.js";
import {
  tryChangeLikePost,
  addNewPost,
  aggregatePost,
  getFeedByUserId,
  getPostById,
} from "../services/posts.js";
import { logActivity } from "../services/activity-log.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { DoubleRequestError } from "../services/posts.js";

const postsRouter = express.Router();
const uuidSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

// API: /feed?userId=b8b7a435-1cc2-49ca-9a71-5dfc9b746542
postsRouter.get(
  "/feed",
  validateSchema({
    query: Joi.object({
      userId: uuidSchema,
    }),
  }),
  async (req, res) => {
    const { userId } = req.query;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).send(`User with ID ${userId} wasn't found`);
    }

    const feed = await getFeedByUserId(userId);

    return res.send(feed);
  }
);

const maxChars = 300;
const schemaAddNewPost = Joi.object({
  text: Joi.string()
    .required()
    .max(maxChars)
    .rule({ message: `Post's text is maximum ${maxChars} charachters.` }),
  imageUrl: Joi.string().required().allow(""),
});

postsRouter.post(
  "/",
  validateSchema({ body: schemaAddNewPost }),
  async (req, res) => {
    const { _id: creatorId, username } = req.user;
    const { text, imageUrl } = req.body;
    const newPostToAdd = { creatorId, text, imageUrl };
    const addedPost = await addNewPost(newPostToAdd);

    const feedPost = await aggregatePost(addedPost);

    await logActivity({ username, activityType: "post" });

    return res.status(201).send(feedPost);
  }
);

postsRouter.post(
  "/:postId/:changeLike",
  validateSchema({
    params: Joi.object({
      postId: uuidSchema,
      changeLike: Joi.string().valid("like", "unlike"),
    }),
  }),
  async (req, res) => {
    const { _id: likerId } = req.user;
    const { postId, changeLike } = req.params;
    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).send(`Post with ID ${postId} was not found`);
    }

    try {
      const changedLikePost = await tryChangeLikePost(changeLike, likerId, postId);
      const feedPost = await aggregatePost(changedLikePost);

      return res.status(200).send(feedPost);
    } catch (e) {
      if (e instanceof DoubleRequestError) {
        return res.status(400).send(e.message);
      }

      return res.status(500).send(`Cannot like the post: ${e.message}`);
    }
  }
);

export default postsRouter;
