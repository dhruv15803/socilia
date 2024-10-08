"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = require("../controllers/file.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const router = express_1.default.Router();
router.post("/upload", multer_middleware_1.upload.array("post_files", 6), file_controller_1.uploadFiles);
router.post("/upload_single", multer_middleware_1.upload.single("img_file"), file_controller_1.uploadFile);
exports.default = router;
