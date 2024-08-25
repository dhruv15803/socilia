import { Request, Response } from "express";
import { client } from "..";


type createPostRequestBody = {
    post_title:string;
    post_content:string;
    post_images:string[];
}


const createPost = async (req:Request,res:Response) => {
    try {
        const {post_content,post_images,post_title} = req.body as createPostRequestBody;
        const userId = req.userId;
        const user  = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"invalid user id"});
        const post = await client.post.create({data:{post_title:post_title.trim(),post_content:post_content.trim(),post_images:post_images,post_author_id:user.id}});
        return res.status(201).json({"success":true,"message":"post created",post});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when creating a post"});
    }
} 

export {
    createPost,
}