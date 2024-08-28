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

const fetchPosts = async (req:Request,res:Response) => {
    try {
        const query = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = page * limit - limit;
        const posts = await client.post.findMany({
            include:{
                _count:{select:{PostLike:true,Comment:true}},
                post_author:{
                    select:{
                        username:true,
                        user_image:true,
                        id:true,
                        email:true,
                    }
                },
                PostLike:{
                    select:{
                        liked_by:{
                            select:{
                                id:true,
                                username:true,
                                user_image:true,
                                email:true,
                            }
                        }
                    }
                }
            },
            orderBy:{createdAt:"desc"},
            skip:skip,
            take:limit,
        });
        const total = await client.post.count();
        return res.status(200).json({"success":true,posts,noOfPages:Math.ceil(total/limit)});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when getting posts"});
    }
}


const likePost = async (req:Request,res:Response) => {
    try {
        const {postId}:{postId:string} = req.body;
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        const post = await client.post.findUnique({where:{id:postId}});
        let responseMsg = "";
        if(!user || !post) return res.status(400).json({"success":false,"message":"post or user do not exist"});
        // if user's like already exists on post => remove like , else add like
        // checking if like exists
        let isLiked = false;
        const liked = await client.postLike.findUnique({where:{liked_by_id_liked_post_id:{liked_by_id:user.id,liked_post_id:post.id}}});
        if(liked) {
            // remove like
            await client.postLike.delete({where:{liked_by_id_liked_post_id:{liked_by_id:liked.liked_by_id,liked_post_id:liked.liked_post_id}}});
            responseMsg = "removed like from post";
        } else {
            // add like
            const like = await client.postLike.create({data:{liked_by_id:user.id,liked_post_id:post.id}});
            responseMsg="added like on post";
            isLiked = true;
        }
        return res.status(200).json({"success":true,"message":responseMsg,isLiked});
    } catch (error) {
        console.log(error);
        return res.status(400).json({"success":false,"message":"Something went wrong when liking post"});
    }
}

const fetchPost = async (req:Request,res:Response) => {
    try {
        const {postId} = req.params;
        const post = await client.post.findUnique({where:{id:postId},include:{
            _count:{select:{PostLike:true,Comment:true}},
            post_author:{
                select:{
                    username:true,
                    user_image:true,
                    id:true,
                    email:true,
                }
            },
            PostLike:{
                select:{
                    liked_by:{
                        select:{
                            id:true,
                            username:true,
                            user_image:true,
                            email:true,
                        }
                    }
                }
            }
        }});
        if(!post) return res.status(400).json({"success":false,"message":"Invalid post id"});
        return res.status(200).json({"success":true,post});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching post"});
    }
}

const fetchMyPosts = async (req:Request,res:Response) => {
    try {
        const query = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = page * limit - limit;
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"user invalid id"});
        const posts = await client.post.findMany({where:{post_author_id:user.id},include:{
            _count:{select:{PostLike:true,Comment:true}},
            post_author:{
                select:{
                    username:true,
                    user_image:true,
                    id:true,
                    email:true,
                }
            },
            PostLike:{
                select:{
                    liked_by:{
                        select:{
                            id:true,
                            username:true,
                            user_image:true,
                            email:true,
                        }
                    }
                }
            }
        },
        skip:skip,
        take:limit,
    });
    const total = await client.post.count({where:{post_author_id:user.id}});
    return res.status(200).json({"success":true,posts,"noOfPages":Math.ceil(total/limit)});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching posts"});
    }
}


export {
    createPost,
    fetchPosts,
    likePost,
    fetchPost,
    fetchMyPosts,
}