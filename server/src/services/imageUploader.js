import multer from "multer";
import fs from "fs";

const fsPromises = fs.promises;
const ERROR = null;
const STORAGE_PATH = "public/images";
export const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(ERROR, STORAGE_PATH);
  },
  filename: (req, file, cb) => {
    return cb(ERROR, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!whitelist.includes(file.mimetype)) {
    return cb(
      new TypeError(
        `File format ${file.mimetype} is not allowed. Only: ${whitelist}`
      )
    );
  }

  cb(null, true);
};

export const upload = multer({ storage, fileFilter }).single("file");

export const removeImage = async (pathToFile) => {
  if (!pathToFile) {
    return;
  }

  await fsPromises.unlink(`public/${pathToFile}`);
  console.log("Delete File successfully.");
};
