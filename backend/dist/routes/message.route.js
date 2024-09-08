"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
router.get("/messages/:selectedId", auth_middleware_1.authenticatedUser, message_controller_1.fetchConversationMessages);
router.post("/create", auth_middleware_1.authenticatedUser, message_controller_1.createMessage);
exports.default = router;
