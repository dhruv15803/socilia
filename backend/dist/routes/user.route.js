"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.post("/follow", auth_middleware_1.authenticatedUser, user_controller_1.followUser);
router.get("/followers", auth_middleware_1.authenticatedUser, user_controller_1.fetchFollowers);
router.get('/following', auth_middleware_1.authenticatedUser, user_controller_1.fetchFollowing);
router.get("/users", user_controller_1.fetchUsers);
exports.default = router;
