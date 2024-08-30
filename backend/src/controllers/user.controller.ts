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
        return res.status(200).json({"success":true,"message":responseMsg,"isFollow":follow,following});
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


type editProfileRequestBody = {
    firstName:string;
    lastName:string;
    bioData:string;
    imgUrl:string;
}

const editProfile = async (req:Request,res:Response) => {
    try {
        const {firstName,lastName,bioData,imgUrl} = req.body as editProfileRequestBody;
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"invalid userid"});
        const newUser = await client.user.update({where:{id:user.id},data:{user_image:imgUrl,firstName:firstName.trim(),lastName:lastName.trim(),bio_data:bioData.trim()}});
        return res.status(200).json({"success":true,newUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when editing profile"});
    }

}

const searchUsers = async (req:Request,res:Response) => {
    try {
        const {searchText} = req.query as {searchText:string};
        // search by username -> return all username that starts with searchText or ends with searchText or have searchText in the middle
        const users = await client.user.findMany({where:{username:{contains:searchText}}});
        return res.status(200).json({"success":true,users});
    } catch (error) {
        return res.status(500).json({"success":false,"message":"Something went wrong when searching users"});
    }
}


export {
    followUser,
    fetchFollowers,
    fetchFollowing,
    fetchUsers,
    editProfile,
    searchUsers,
}