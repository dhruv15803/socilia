import express from 'express'
import { getAuthenticatedUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller';
import { authenticatedUser } from '../middlewares/auth.middleware';
import {body} from 'express-validator'

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",authenticatedUser,logoutUser);
router.get("/current",authenticatedUser,getAuthenticatedUser);

export default router;