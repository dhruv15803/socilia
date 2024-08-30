"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.editProfile = exports.fetchUsers = exports.fetchFollowing = exports.fetchFollowers = exports.followUser = void 0;
const __1 = require("..");
const fetchUsers = async (req, res) => {
    try {
        const users = await __1.client.user.findMany();
        return res.status(200).json({ "success": true, users });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching users" });
    }
};
exports.fetchUsers = fetchUsers;
const followUser = async (req, res) => {
    try {
        const { followId } = req.body;
        const userId = req.userId;
        // user Id (authenticated user  -> following followId user);
        const follower = await __1.client.user.findUnique({ where: { id: userId } });
        const following = await __1.client.user.findUnique({ where: { id: followId } });
        if (!follower || !following || follower.id === following.id)
            return res.status(400).json({ "success": false, "message": "Invalid follower and follwing id's" });
        const isFollowing = await __1.client.following.findUnique({ where: { follower_id_following_id: { follower_id: follower.id, following_id: following.id } } });
        let responseMsg = "";
        let follow = true;
        if (isFollowing) {
            // remove follow
            await __1.client.following.delete({ where: { follower_id_following_id: { follower_id: isFollowing.follower_id, following_id: isFollowing.following_id } } });
            responseMsg = `unfollowed ${following.username}`;
            follow = false;
        }
        else {
            await __1.client.following.create({ data: { follower_id: follower.id, following_id: following.id } });
            responseMsg = `followed ${following.username}`;
            follow = true;
        }
        return res.status(200).json({ "success": true, "message": responseMsg, "isFollow": follow, following });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when following" });
    }
};
exports.followUser = followUser;
const fetchFollowers = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "Invalid userId" });
        const followers = await __1.client.user.findUnique({ where: { id: user.id }, include: {
                _count: { select: { Followers: true } },
                Followers: {
                    select: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                user_image: true,
                            }
                        }
                    }
                }
            } });
        return res.status(200).json({ "success": true, "followers": followers?.Followers, "followers_count": followers?._count.Followers });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching followers" });
    }
};
exports.fetchFollowers = fetchFollowers;
const fetchFollowing = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "invalid userId" });
        const following = await __1.client.user.findUnique({ where: { id: userId }, include: {
                _count: { select: { Following: true } },
                Following: {
                    select: {
                        following: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                user_image: true,
                            }
                        }
                    }
                }
            } });
        return res.status(200).json({ "success": true, "following": following?.Following, "following_count": following?._count.Following });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when getting follwings" });
    }
};
exports.fetchFollowing = fetchFollowing;
const editProfile = async (req, res) => {
    try {
        const { firstName, lastName, bioData, imgUrl } = req.body;
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "invalid userid" });
        const newUser = await __1.client.user.update({ where: { id: user.id }, data: { user_image: imgUrl, firstName: firstName.trim(), lastName: lastName.trim(), bio_data: bioData.trim() } });
        return res.status(200).json({ "success": true, newUser });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when editing profile" });
    }
};
exports.editProfile = editProfile;
const searchUsers = async (req, res) => {
    try {
        const { searchText } = req.query;
        // search by username -> return all username that starts with searchText or ends with searchText or have searchText in the middle
        const users = await __1.client.user.findMany({ where: { username: { contains: searchText } } });
        return res.status(200).json({ "success": true, users });
    }
    catch (error) {
        return res.status(500).json({ "success": false, "message": "Something went wrong when searching users" });
    }
};
exports.searchUsers = searchUsers;
