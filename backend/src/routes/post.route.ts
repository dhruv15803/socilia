import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { createPost, fetchPosts, likePost } from "../controllers/post.controller";

const router = express.Router();

router.post("/create",authenticatedUser,createPost);
router.get("/posts",fetchPosts);
router.post("/like",authenticatedUser,likePost);

export default router;
