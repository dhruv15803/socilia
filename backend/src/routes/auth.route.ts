import express from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controller';
import { authenticatedUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",authenticatedUser,logoutUser);

export default router;