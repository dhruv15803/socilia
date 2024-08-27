import { Request, response, Response } from "express";
import { client } from "..";


const fetchUsers = async (req:Request,res:Response) => {
    try {
        const users = await client.user.findMany();
        return res.status(200).json({"success":true,users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching users"});
    }
}


const followUser = async (req:Request,res:Response) => {
    try {
        const {followId} = req.body as {followId:string}
        const userId = req.userId;
        // user Id (authenticated user  -> following followId user);
        const follower = await client.user.findUnique({where:{id:userId}});
        const following = await client.user.findUnique({where:{id:followId}});
        if(!follower || !following || follower.id===following.id) return res.status(400).json({"success":false,"message":"Invalid follower and follwing id's"}); 
        const isFollowing = await client.following.findUnique({where:{follower_id_following_id:{follower_id:follower.id,following_id:following.id}}});
        let responseMsg="";
        let follow = true;
        if(isFollowing) {
            // remove follow
            await client.following.delete({where:{follower_id_following_id:{follower_id:isFollowing.follower_id,following_id:isFollowing.following_id}}});
            responseMsg=`unfollowed ${following.username}`
            follow=false;

        } else {
            await client.following.create({data:{follower_id:follower.id,following_id:following.id}});
            responseMsg=`followed ${following.username}`
            follow=true;
        }        
        return res.status(200).json({"success":true,"message":responseMsg,"isFollow":follow});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when following"});
    }
}

const fetchFollowers = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"Invalid userId"});
        const followers = await client.user.findUnique({where:{id:user.id},include:{
            _count:{select:{Followers:true}},
            Followers:{
                select:{
                    follower:{
                        select:{
                            id:true,
                            username:true,
                            email:true,
                            user_image:true,
                        }
                    }
                }
            }
        }});
        return res.status(200).json({"success":true,"followers":followers?.Followers,"followers_count":followers?._count.Followers});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching followers"});
    }
}


const fetchFollowing = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"invalid userId"});
        const following = await client.user.findUnique({where:{id:userId},include:{
            _count:{select:{Following:true}},
            Following:{
                select:{
                    following:{
                        select:{
                            id:true,
                            username:true,
                            email:true,
                            user_image:true,
                        }
                    }
                }
            }
        }});
        return res.status(200).json({"success":true,"following":following?.Following,"following_count":following?._count.Following});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when getting follwings"});
    }
} 

export {
    followUser,
    fetchFollowers,
    fetchFollowing,
    fetchUsers,
}