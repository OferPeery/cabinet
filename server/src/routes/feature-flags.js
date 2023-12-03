import express from "express";
import Joi from "joi";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";
import { validateSchema } from "../middleware/validateSchema.js";
import {
  getFeatureFlags,
  getFeatureFlagsValues,
  updateFeatureFlag,
} from "../services/feature-flags.js";

const featureFlagsRouter = express.Router();
const uuidSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

featureFlagsRouter.get("/", authenticateAdmin, async (_, res) => {
  const flags = await getFeatureFlags();
  return res.send(flags);
});

featureFlagsRouter.put(
  "/:id",
  authenticateAdmin,
  validateSchema({
    params: Joi.object({
      id: uuidSchema,
    }),
    body: Joi.object({
      value: Joi.boolean().required(),
    }),
  }),
  async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const flag = await updateFeatureFlag(id, value);

    if (!flag) {
      return res.status(404).send(`Flag with ID ${id} wasn't found`);
    }

    return res.send(flag);
  }
);

featureFlagsRouter.get("/values", async (_, res) => {
  const flags = await getFeatureFlagsValues();
  return res.send(flags);
});

export default featureFlagsRouter;
