"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMyPosts = exports.fetchPost = exports.likePost = exports.fetchPosts = exports.createPost = void 0;
const __1 = require("..");
const createPost = async (req, res) => {
    try {
        const { post_content, post_images, post_title } = req.body;
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "invalid user id" });
        const post = await __1.client.post.create({ data: { post_title: post_title.trim(), post_content: post_content.trim(), post_images: post_images, post_author_id: user.id } });
        return res.status(201).json({ "success": true, "message": "post created", post });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when creating a post" });
    }
};
exports.createPost = createPost;
const fetchPosts = async (req, res) => {
    try {
        const query = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit - limit;
        const posts = await __1.client.post.findMany({
            include: {
                _count: { select: { PostLike: true, Comment: true } },
                post_author: {
                    select: {
                        username: true,
                        user_image: true,
                        id: true,
                        email: true,
                    }
                },
                PostLike: {
                    select: {
                        liked_by: {
                            select: {
                                id: true,
                                username: true,
                                user_image: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            skip: skip,
            take: limit,
        });
        const total = await __1.client.post.count();
        return res.status(200).json({ "success": true, posts, noOfPages: Math.ceil(total / limit) });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when getting posts" });
    }
};
exports.fetchPosts = fetchPosts;
const likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        const post = await __1.client.post.findUnique({ where: { id: postId } });
        let responseMsg = "";
        if (!user || !post)
            return res.status(400).json({ "success": false, "message": "post or user do not exist" });
        // if user's like already exists on post => remove like , else add like
        // checking if like exists
        let isLiked = false;
        const liked = await __1.client.postLike.findUnique({ where: { liked_by_id_liked_post_id: { liked_by_id: user.id, liked_post_id: post.id } } });
        if (liked) {
            // remove like
            await __1.client.postLike.delete({ where: { liked_by_id_liked_post_id: { liked_by_id: liked.liked_by_id, liked_post_id: liked.liked_post_id } } });
            responseMsg = "removed like from post";
        }
        else {
            // add like
            const like = await __1.client.postLike.create({ data: { liked_by_id: user.id, liked_post_id: post.id } });
            responseMsg = "added like on post";
            isLiked = true;
        }
        return res.status(200).json({ "success": true, "message": responseMsg, isLiked });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ "success": false, "message": "Something went wrong when liking post" });
    }
};
exports.likePost = likePost;
const fetchPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await __1.client.post.findUnique({ where: { id: postId }, include: {
                _count: { select: { PostLike: true, Comment: true } },
                post_author: {
                    select: {
                        username: true,
                        user_image: true,
                        id: true,
                        email: true,
                    }
                },
                PostLike: {
                    select: {
                        liked_by: {
                            select: {
                                id: true,
                                username: true,
                                user_image: true,
                                email: true,
                            }
                        }
                    }
                }
            } });
        if (!post)
            return res.status(400).json({ "success": false, "message": "Invalid post id" });
        return res.status(200).json({ "success": true, post });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching post" });
    }
};
exports.fetchPost = fetchPost;
const fetchMyPosts = async (req, res) => {
    try {
        const query = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit - limit;
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(400).json({ "success": false, "message": "user invalid id" });
        const posts = await __1.client.post.findMany({ where: { post_author_id: user.id }, include: {
                _count: { select: { PostLike: true, Comment: true } },
                post_author: {
                    select: {
                        username: true,
                        user_image: true,
                        id: true,
                        email: true,
                    }
                },
                PostLike: {
                    select: {
                        liked_by: {
                            select: {
                                id: true,
                                username: true,
                                user_image: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            skip: skip,
            take: limit,
        });
        const total = await __1.client.post.count({ where: { post_author_id: user.id } });
        return res.status(200).json({ "success": true, posts, "noOfPages": Math.ceil(total / limit) });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching posts" });
    }
};
exports.fetchMyPosts = fetchMyPosts;
