"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const post_controller_1 = require("../controllers/post.controller");
const router = express_1.default.Router();
router.post("/create", auth_middleware_1.authenticatedUser, post_controller_1.createPost);
router.get("/posts", post_controller_1.fetchPosts);
router.post("/like", auth_middleware_1.authenticatedUser, post_controller_1.likePost);
router.get("/:postId", auth_middleware_1.authenticatedUser, post_controller_1.fetchPost);
exports.default = router;
