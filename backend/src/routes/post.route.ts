import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createPost } from "../controllers/post.controller";

const router = express.Router();

router.post("/create",authenticatedUser,createPost);


export default router;
