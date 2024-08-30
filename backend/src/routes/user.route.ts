
import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { editProfile, fetchFollowers, fetchFollowing, fetchUsers, followUser, searchUsers } from "../controllers/user.controller";

const router = express.Router();

router.post("/follow",authenticatedUser,followUser);
router.get("/followers",authenticatedUser,fetchFollowers);
router.get('/following',authenticatedUser,fetchFollowing);
router.get("/users",fetchUsers);
router.put("/edit",authenticatedUser,editProfile);
router.get("/search",searchUsers);
export default router;
