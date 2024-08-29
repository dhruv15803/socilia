"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.fetchPostComments = exports.createComment = void 0;
const __1 = require("..");
const createComment = async (req, res) => {
    try {
        const { post_id, comment_text } = req.body;
        const userId = req.userId;
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        const post = await __1.client.post.findUnique({ where: { id: post_id } });
        if (!user || !post)
            return res.status(400).json({ "success": false, "message": "invalid userid" });
        const comment = await __1.client.comment.create({ data: {
                comment_text: comment_text.trim(),
                comment_author_id: user.id,
                post_id: post.id,
            }, include: {
                _count: { select: { CommentLike: true } },
                comment_author: {
                    select: {
                        id: true,
                        username: true,
                        user_image: true,
                        email: true,
                    }
                },
                CommentLike: {
                    select: {
                        liked_by: {
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
        return res.status(201).json({ "success": true, comment });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when creating comment" });
    }
};
exports.createComment = createComment;
const fetchPostComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit - limit;
        const { postId } = req.params;
        const post = await __1.client.post.findUnique({ where: { id: postId } });
        if (!post)
            return res.status(400).json({ "success": false, "message": "invalid postid" });
        const comments = await __1.client.comment.findMany({ where: { post_id: post.id }, include: {
                _count: { select: { CommentLike: true } },
                comment_author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        user_image: true,
                    }
                },
                CommentLike: {
                    select: {
                        liked_by: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                user_image: true,
                            }
                        }
                    }
                }
            },
            skip: skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        });
        const total = await __1.client.comment.count({ where: { post_id: post.id } });
        return res.status(200).json({ "success": true, comments, "noOfPages": Math.ceil(total / limit) });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when fetching post comments" });
    }
};
exports.fetchPostComments = fetchPostComments;
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;
        const comment = await __1.client.comment.findUnique({ where: { id: commentId } });
        const user = await __1.client.user.findUnique({ where: { id: userId } });
        if (!comment || !user)
            return res.status(400).json({ "success": false, "message": "user or comment not found" });
        // check if comments author is the current authenticated user
        let responseMsg = "";
        let isDelete = false;
        if (comment.comment_author_id === user.id) {
            await __1.client.comment.delete({ where: { id: comment.id } });
            isDelete = true;
            responseMsg = "comment deleted";
        }
        else {
            isDelete = false;
            responseMsg = "user not author of comment";
        }
        return res.status(200).json({ "success": true, "message": responseMsg, isDelete });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when deleting comment" });
    }
};
exports.deleteComment = deleteComment;
