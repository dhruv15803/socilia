"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
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
