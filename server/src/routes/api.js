import express from "express";

import authRouter from "./auth.js";
import postsRouter from "./posts.js";
import usersRouter from "./users.js";
import featureFlagsRouter from "./feature-flags.js";
import activityLogRouter from "./activity-log.js";

import { authenticateToken } from "../middleware/authenticateToken.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

const businessLogicRouter = express.Router();
businessLogicRouter.use(authenticateToken);
businessLogicRouter.use("/posts", postsRouter);
businessLogicRouter.use("/users", usersRouter);
businessLogicRouter.use("/feature-flags", featureFlagsRouter);
businessLogicRouter.use("/activity-log", authenticateAdmin, activityLogRouter);

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/", businessLogicRouter);

export default apiRouter;
