
import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { fetchFollowers, fetchFollowing, fetchUsers, followUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/follow",authenticatedUser,followUser);
router.get("/followers",authenticatedUser,fetchFollowers);
router.get('/following',authenticatedUser,fetchFollowing);
router.get("/users",fetchUsers);

export default router;
