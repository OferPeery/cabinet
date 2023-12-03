import express from "express";
import { upload } from "../services/imageUploader.js";

const imageRouter = express.Router();

imageRouter.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof TypeError) {
        return res.status(422).send(err.message);
      }

      return res.status(500).send(err.message);
    }

    const pathToFile = `images/${req.file.filename}`;

    return res.status(201).send(pathToFile);
  });
});

imageRouter.use("/", express.static("public"));

export default imageRouter;
