"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRequestAccept = exports.fetchFollowRequestsSent = exports.fetchFollowRequests = exports.fetchUser = exports.searchUsers = exports.editProfile = exports.fetchUsers = exports.fetchFollowing = exports.fetchFollowers = exports.followRequest = void 0;
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
const followRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { followId } = req.body;
        const follower = await __1.client.user.findUnique({ where: { id: userId } });
        const following = await __1.client.user.findUnique({ where: { id: followId } });
        if (!follower || !following || follower.id === following.id)
            return res.status(400).json({ "success": false, "message": "user and following party not available" });
        // if user is already followingg user with id:followId => remove follow and return response
        const isFollow = await __1.client.following.findUnique({ where: { follower_id_following_id: {
                    follower_id: follower.id,
                    following_id: following.id,
                } } });
        if (isFollow) {
            // remove follow
            await __1.client.following.delete({ where: { follower_id_following_id: {
                        follower_id: follower.id,
                        following_id: following.id,
                    } } });
            return res.status(200).json({ "success": true, "message": "unfollowed user", "unfollowed": true, "isRequested": false });
        }
        // if there is already a request send to following from follower (Cancel request)
        // else create follow request
        let newRequest = null;
        const requested = await __1.client.followRequests.findUnique({ where: { request_sender_id_request_receiver_id: {
                    request_sender_id: follower.id,
                    request_receiver_id: following.id,
                } } });
        let responseMsg = "";
        let isRequested = false;
        if (requested) {
            // remove request
            await __1.client.followRequests.delete({ where: { request_sender_id_request_receiver_id: {
                        request_sender_id: requested.request_sender_id,
                        request_receiver_id: requested.request_receiver_id,
                    } } });
            isRequested = false;
            responseMsg = "cancelled follow request";
        }
        else {
            // create request
            newRequest = await __1.client.followRequests.create({ data: { request_sender_id: follower.id, request_receiver_id: following.id }, include: {
                    request_receiver: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            user_image: true,
                        }
                    }
                } });
            isRequested = true;
            responseMsg = "follow request sent";
        }
        return res.status(200).json({ "success": true, "message": responseMsg, isRequested, "unfollowed": false, newRequest });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when sending follow request" });
    }
};
exports.followRequest = followRequest;
const followRequestAccept = async (req, res) => {
    try {
        const { senderId } = req.body;
        const userId = req.userId;
        const receiver = await __1.client.user.findUnique({ where: { id: userId } });
        const sender = await __1.client.user.findUnique({ where: { id: senderId } });
        if (!receiver || !sender)
            return res.status(400).json({ "success": false, "message": "receiver or sender not found" });
        // before accepting a follow request => check if follow request from user with senderId exists . if exists => remove the request and create a follow (follower being the sender and following the receiver);
        const request = await __1.client.followRequests.findUnique({ where: { request_sender_id_request_receiver_id: {
                    request_sender_id: sender.id,
                    request_receiver_id: receiver.id,
                } } });
        // if request doesnt exist () response (400)
        if (!request)
            return res.status(400).json({ "success": false, "message": "follow request doesn't exist" });
        // create a follow from the sender to receiver .
        const newFollow = await __1.client.following.create({ data: { follower_id: sender.id, following_id: receiver.id } });
        // remove follow request
        await __1.client.followRequests.delete({ where: { request_sender_id_request_receiver_id: {
                    request_sender_id: sender.id,
                    request_receiver_id: receiver.id,
                } } });
        return res.status(200).json({ "success": true, "message": "follow accepted" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "something went wrong when accepting follow request" });
    }
};
exports.followRequestAccept = followRequestAccept;
const fetchFollowRequests = async (req, res) => {
    try {
        //get all requests directed to loggedin user.
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "user not available" });
        const followRequests = await __1.client.user.findUnique({ where: { id: user.id }, include: {
                _count: { select: { FollowRequestsReceived: true } },
                FollowRequestsReceived: {
                    select: {
                        request_sender: {
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                user_image: true,
                            }
                        }
                    },
                },
            } });
        return res.status(200).json({ "success": true, "follow_requests": followRequests?.FollowRequestsReceived, "follow_requests_count": followRequests?._count.FollowRequestsReceived });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching follow requests" });
    }
};
exports.fetchFollowRequests = fetchFollowRequests;
const fetchFollowRequestsSent = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "user not available" });
        const requestsSent = await __1.client.user.findUnique({ where: { id: user.id }, include: {
                _count: { select: { FollowRequestsSent: true } },
                FollowRequestsSent: {
                    select: {
                        request_receiver: {
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                user_image: true,
                            }
                        }
                    }
                }
            } });
        return res.status(200).json({ "success": true, "follow_requests_sent": requestsSent?.FollowRequestsSent, "follow_requests_sent_count": requestsSent?._count.FollowRequestsSent });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "something went wrong when fetching follow requests sent" });
    }
};
exports.fetchFollowRequestsSent = fetchFollowRequestsSent;
const fetchFollowers = async (req, res) => {
    try {
        const userId = req.query.userId || req.userId;
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
        const userId = req.query.userId || req.userId;
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
const fetchUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "user not found" });
        return res.status(200).json({ "success": true, user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching user" });
    }
};
exports.fetchUser = fetchUser;
