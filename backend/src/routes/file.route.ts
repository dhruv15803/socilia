
import express from "express"
import { uploadFile, uploadFiles } from "../controllers/file.controller";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();


router.post("/upload",upload.array("post_files",6),uploadFiles);
router.post("/upload_single",upload.single("img_file"),uploadFile);

export default router;
