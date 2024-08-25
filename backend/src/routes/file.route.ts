
import express from "express"
import { uploadFiles } from "../controllers/file.controller";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();


router.post("/upload",upload.array("post_files",6),uploadFiles);

export default router;
