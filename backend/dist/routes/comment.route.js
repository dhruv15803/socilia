"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const comment_controller_1 = require("../controllers/comment.controller");
const router = express_1.default.Router();
router.post("/create", auth_middleware_1.authenticatedUser, comment_controller_1.createComment);
router.get("/comments/:postId", comment_controller_1.fetchPostComments);
router.get("/child_comments/:parent_comment_id", comment_controller_1.fetchChildComments);
router.post("/like", auth_middleware_1.authenticatedUser, comment_controller_1.likeComment);
router.delete("/:commentId", auth_middleware_1.authenticatedUser, comment_controller_1.deleteComment);
exports.default = router;
