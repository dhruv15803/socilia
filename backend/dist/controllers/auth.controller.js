"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedUser = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = async (req, res) => {
    if (req.cookies?.auth_token)
        return res.status(400).json({ "success": false, "message": "auth_token already exists" });
    try {
        const { email, username, password } = req.body;
        const user = await __1.client.user.findFirst({ where: { OR: [{ email: email.trim().toLowerCase() }, { username: username.trim().toLowerCase() }] } });
        if (user)
            return res.status(400).json({ "success": false, "message": "user already exists" });
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = await __1.client.user.create({ data: { email: email.trim().toLowerCase(), username: username.trim().toLowerCase(), password: hashedPassword } });
        const jwtToken = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        return res.cookie("auth_token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24,
        }).json({ "success": true, "message": "User registered successfully", "user": newUser });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when registering user" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    // user can login either by username or email
    if (req.cookies?.auth_token)
        return res.status(400).json({ "success": false, "message": "auth_token already exists" });
    try {
        const { email, password, username } = req.body;
        let isLoginByEmail = true;
        if (email.trim() === "") {
            isLoginByEmail = false;
        }
        let incorrectCredMsg = isLoginByEmail ? "Incorrect email or password" : "Incorrect username or password";
        const user = isLoginByEmail ? await __1.client.user.findUnique({ where: { email: email.trim().toLowerCase() } }) : await __1.client.user.findUnique({ where: { username: username.trim().toLowerCase() } });
        if (!user)
            return res.status(400).json({ "success": false, "message": incorrectCredMsg });
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ "success": false, "message": incorrectCredMsg });
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        return res.cookie("auth_token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24,
        }).json({ "success": true, "message": "user logged in", "user": user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when loggin in" });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "invalid user" });
        return res.clearCookie("auth_token").json({ "success": true, "message": "user logged out" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when logging out" });
    }
};
exports.logoutUser = logoutUser;
const getAuthenticatedUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "invalid user id" });
        return res.status(200).json({ "success": true, user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "sucess": false, "message": "Something went wrong when getting authenticated user" });
    }
};
exports.getAuthenticatedUser = getAuthenticatedUser;
