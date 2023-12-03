import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/api.js";
import imageRouter from "./routes/images.js";
import { authenticateToken } from "./middleware/authenticateToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = [__dirname, "..", "..", "client", "build"];

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send(err.message);
  }
  next();
});

app.use(cookieParser());
app.use(express.static(path.join(...clientPath)));
app.use(express.static("public"));

app.use("/api", apiRouter);
app.use("/images", authenticateToken, imageRouter);

app.get("*", async (_, res) => {
  res.sendFile(path.join(...clientPath, "index.html"));
});

export default app;
