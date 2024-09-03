
import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware";
import { editProfile, fetchFollowers, fetchFollowing, fetchFollowRequests, fetchFollowRequestsSent, fetchUser, fetchUsers, followRequest, followRequestAccept, searchUsers } from "../controllers/user.controller";

const router = express.Router();

router.post("/follow",authenticatedUser,followRequest);
router.get("/follow_requests",authenticatedUser,fetchFollowRequests);
router.get("/follow_requests_sent",authenticatedUser,fetchFollowRequestsSent);
router.post("/accept_follow_request",authenticatedUser,followRequestAccept);
router.get("/followers",authenticatedUser,fetchFollowers);
router.get('/following',authenticatedUser,fetchFollowing);
router.get("/users",fetchUsers);
router.put("/edit",authenticatedUser,editProfile);
router.get("/search",searchUsers);
router.get("/:userId",fetchUser);
export default router;
