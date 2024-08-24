"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticatedUser = async (req, res, next) => {
    if (!req.cookies?.auth_token)
        return res.status(400).json({ "success": false, "message": "no auth_token available" });
    const decoded = jsonwebtoken_1.default.verify(req.cookies.auth_token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    req.userId = userId;
    next();
};
exports.authenticatedUser = authenticatedUser;
