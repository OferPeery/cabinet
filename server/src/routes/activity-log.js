import express from "express";
import { getActivityLog } from "../services/activity-log.js";

const activityLogRouter = express.Router();

activityLogRouter.get("/", async (_, res) => {
  const log = await getActivityLog();
  return res.send(log);
});

export default activityLogRouter;
