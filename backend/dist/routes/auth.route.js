"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.registerUser);
router.post("/login", auth_controller_1.loginUser);
router.get("/logout", auth_middleware_1.authenticatedUser, auth_controller_1.logoutUser);
router.get("/current", auth_middleware_1.authenticatedUser, auth_controller_1.getAuthenticatedUser);
exports.default = router;
