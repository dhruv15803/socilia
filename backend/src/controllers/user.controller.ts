import { Request, response, Response } from "express";
import { client, getSocketId, io } from "..";


const fetchUsers = async (req:Request,res:Response) => {
    try {
        const users = await client.user.findMany();
        return res.status(200).json({"success":true,users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching users"});
    }
}


const followRequest = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const {followId} = req.body;
        const follower = await client.user.findUnique({where:{id:userId}});
        const following = await client.user.findUnique({where:{id:followId}});
        if(!follower || !following || follower.id===following.id) return res.status(400).json({"success":false,"message":"user and following party not available"});
        const receiverSocketId = getSocketId(following.id);

        // if user is already followingg user with id:followId => remove follow and return response
        const isFollow = await client.following.findUnique({where:{follower_id_following_id:{
            follower_id:follower.id,
            following_id:following.id,
        }}});

        if(isFollow) {
            // remove follow
            await client.following.delete({where:{follower_id_following_id:{
                follower_id:follower.id,
                following_id:following.id,
            }}});

            return res.status(200).json({"success":true,"message":"unfollowed user","unfollowed":true,"isRequested":false});


        }
        // if there is already a request send to following from follower (Cancel request)
        // else create follow request
        let newRequest = null;
        const requested = await client.followRequests.findUnique({where:{request_sender_id_request_receiver_id:{
            request_sender_id:follower.id,
            request_receiver_id:following.id,
        }}});
        let responseMsg="";
        let isRequested = false;
        if(requested) {
            // remove request
            await client.followRequests.delete({where:{request_sender_id_request_receiver_id:{
                request_sender_id:requested.request_sender_id,
                request_receiver_id:requested.request_receiver_id,
            }}});

            isRequested=false;
            responseMsg="cancelled follow request";
            io.to(receiverSocketId!).emit("remove_request",requested.request_sender_id);
        } else {
            // create request
            newRequest = await client.followRequests.create({data:{request_sender_id:follower.id,request_receiver_id:following.id},include:{
                request_receiver:{
                    select:{
                        id:true,
                        email:true,
                        username:true,
                        user_image:true,
                    }
                }
            }});
            isRequested = true;
            responseMsg="follow request sent";
            if(receiverSocketId) {
                io.to(receiverSocketId).emit("sent_request",newRequest)
            }
        }
        return res.status(200).json({"success":true,"message":responseMsg,isRequested,"unfollowed":false,newRequest});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when sending follow request"});
    }
}

const followRequestAccept = async (req:Request,res:Response) => {
    try {
        const {senderId} = req.body as {senderId:string};
        const userId = req.userId;
        const receiver = await client.user.findUnique({where:{id:userId}});
        const sender = await client.user.findUnique({where:{id:senderId}});
        if(!receiver || !sender) return res.status(400).json({"success":false,"message":"receiver or sender not found"});
    
        // before accepting a follow request => check if follow request from user with senderId exists . if exists => remove the request and create a follow (follower being the sender and following the receiver);
        const request = await client.followRequests.findUnique({where:{request_sender_id_request_receiver_id:{
            request_sender_id:sender.id,
            request_receiver_id:receiver.id,
        }}});
        // if request doesnt exist () response (400)
        if(!request) return res.status(400).json({"success":false,"message":"follow request doesn't exist"});
        // create a follow from the sender to receiver .
        const newFollow = await client.following.create({data:{follower_id:sender.id,following_id:receiver.id}});
        // remove follow request
        await client.followRequests.delete({where:{request_sender_id_request_receiver_id:{
            request_sender_id:sender.id,
            request_receiver_id:receiver.id,
        }}}); 
        
        return res.status(200).json({"success":true,"message":"follow accepted"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"something went wrong when accepting follow request"});
    }
}


const fetchFollowRequests = async (req:Request,res:Response) => {
    try {
            //get all requests directed to loggedin user.
    const userId = req.userId;
    const user = await client.user.findUnique({where:{id:userId}});
    if(!user) return res.status(400).json({"success":false,"message":"user not available"});

    const followRequests = await client.user.findUnique({where:{id:user.id},include:{
        _count:{select:{FollowRequestsReceived:true}},
        FollowRequestsReceived:{
            select:{
                request_sender:{
                    select:{
                        id:true,
                        email:true,
                        username:true,
                        user_image:true,
                    }
                }
            },
        },
    }});

    return res.status(200).json({"success":true,"follow_requests":followRequests?.FollowRequestsReceived,"follow_requests_count":followRequests?._count.FollowRequestsReceived});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching follow requests"});
    }
}

const fetchFollowRequestsSent = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"user not available"});
    
        const requestsSent = await client.user.findUnique({where:{id:user.id},include:{
            _count:{select:{FollowRequestsSent:true}},
            FollowRequestsSent:{
                select:{
                    request_receiver:{
                        select:{
                            id:true,
                            email:true,
                            username:true,
                            user_image:true,
                        }
                    }
                }
            }
        }});
    
        return res.status(200).json({"success":true,"follow_requests_sent":requestsSent?.FollowRequestsSent,"follow_requests_sent_count":requestsSent?._count.FollowRequestsSent});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"something went wrong when fetching follow requests sent"});
    }

}


const fetchFollowers = async (req:Request,res:Response) => {
    try {
        const userId = (req.query.userId as string) || req.userId;
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
        const userId = (req.query.userId as string) || req.userId;
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

const fetchUser = async (req:Request,res:Response) => {
    try {
        const {userId} = req.params;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"user not found"});
        return res.status(200).json({"success":true,user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching user"});
    }
}

export {
    followRequest,
    fetchFollowers,
    fetchFollowing,
    fetchUsers,
    editProfile,
    searchUsers,
    fetchUser,
    fetchFollowRequests,
    fetchFollowRequestsSent,
    followRequestAccept,
}