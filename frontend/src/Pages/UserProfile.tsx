import Loader from "@/components/Loader";
import { useGetUser } from "@/hooks/useGetUser";
import  {useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blankAvatarImg from "../assets/blankAvatarImg.png";
import { useGetFollowing } from "@/hooks/useGetFollowing";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { backendUrl } from "@/App";
import { useGetFollowers } from "@/hooks/useGetFollowers";
import { AppContext } from "@/Context/AppContext";
import { AppContextType, Follower, Following, followUserResponse} from "@/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import FollowerCard from "@/components/FollowerCard";
import FollowingCard from "@/components/FollowingCard";
import { useFollowRequestsSent } from "@/hooks/useFollowRequestsSent";

const UserProfile = () => {
  const navigate = useNavigate();
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isRequested,setIsRequested] = useState<boolean>(false);
  const { userId } = useParams();
  if (!userId) return <>user not found</>;
  const { isLoading, user } = useGetUser(userId);
  const {followers,isLoading:isFollowersLoading,setFollowers,setFollowersCount,followersCount} = useGetFollowers(userId);
  const {following:followings,followingCount,isLoading:isFollowingLoading} = useGetFollowing(userId);
  const {following:myFollowings,setFollowing:setMyFollwings} = useGetFollowing();
  const {followRequestsSent,followRequestsSentCount,isLoading:isFollowRequestsSentLoading,setFollowRequestsSent,setFollowRequestsSentCount} = useFollowRequestsSent();

  console.log(followings);

  const followUserProfile = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/follow`,
        {
          followId: user?.id,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data as followUserResponse;
      if(data.unfollowed) {
        // remove user id from my followings. 
        setIsFollowing(false);
        setFollowersCount((prev) => prev-1);
        const newFollowers = followers.filter((follower) => follower.follower.id!==loggedInUser?.id);
        setFollowers(newFollowers);
      } else if(data.isRequested) {
        setIsRequested(true);
        setFollowRequestsSentCount((prev) => prev+1);
        setFollowRequestsSent((prev) => [...prev , {request_receiver:data.newRequest?.request_receiver!}]);
      } else {
        setIsRequested(false);
        const newFollowRequestsSent = followRequestsSent.filter((followRequest) => followRequest.request_receiver.id!==loggedInUser?.id);
        setFollowRequestsSent(newFollowRequestsSent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async (followId:string) => {
    try {
        const response = await axios.post(
            `${backendUrl}/api/user/follow`,
            {
              followId: followId,
            },
            {
              withCredentials: true,
            }
        );
        const data = response.data as followUserResponse;
        if(data.unfollowed) {
          // change my followings
          const newMyFollowings = myFollowings.filter((myFollowing) => myFollowing.following.id!==followId);
          setMyFollwings(newMyFollowings);
        } else if (data.isRequested) {
          // add request to followRequests
          setFollowRequestsSentCount((prev) => prev+1);
          setFollowRequestsSent((prev) => [...prev , {request_receiver:data.newRequest?.request_receiver!}]);
        } else {
          // remove request 
          setFollowRequestsSentCount((prev) => prev-1);
          const newFollowRequests = followRequestsSent.filter((followRequest) => followRequest.request_receiver.id!==followId);
          setFollowRequestsSent(newFollowRequests);
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    const isFollow = followers.some((follower) => follower.follower.id === loggedInUser?.id);
    const isRequested = followRequestsSent.some((followRequest) => followRequest.request_receiver.id===userId);
    setIsFollowing(isFollow);
    setIsRequested(isRequested);
  }, [user, followers,followRequestsSent]);

  if (isLoading)
    return (
      <>
        <div className="flex items-center justify-center my-16">
          <Loader height="40" width="40" color="black" />
        </div>
      </>
    );

  if (!user)
    return (
      <>
        <div className="flex items-center justify-center my-16">
          User not available
        </div>
      </>
    );

  return (
    <>
      <div className="flex flex-col border rounded-lg p-4 gap-2 mt-12">
        <div className="flex justify-between">
          <img
            className="rounded-full w-28 aspect-auto"
            src={user.user_image !== null ? user.user_image : blankAvatarImg}
            alt=""
          />
          <div className="flex items-center gap-2">
          <Button onClick={() => navigate(`/chat/${user.id}`)}>Message</Button>
          <Button
            onClick={followUserProfile}
            variant={isFollowing ? "destructive" : "default"}
          >
            {isFollowing ? "Unfollow" : isRequested ? "Requested" : "Follow"}
          </Button>
          </div>
        </div>
        {(user.firstName !== null || user.lastName !== null) && (
            <div className="flex items-center gap-1 text-xl font-semibold">
              <div>{user.firstName}</div>
              <div>{user.lastName}</div>
            </div>
        )}
        <div className="text-lg text-gray-700 font-semibold">
            @{user.username}
        </div>
        {user.bio_data !== null && (
            <div className="flex flex-wrap my-2">{user.bio_data}</div>
        )}
        <div className="flex items-center gap-8 justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>Followers</span>
                    {isFollowersLoading ? <>
                        <Loader width="30" height="30" color="black" />
                    </> : <>
                    <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-gray-600 hover:text-black hover:duration-300">{followersCount}</button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Followers</DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          {followers.length !== 0 ? (
                            <>
                              {followers.map((follow: Follower) => {
                                return (
                                  <FollowerCard
                                    followRequestsSent={followRequestsSent}
                                    followings={myFollowings}
                                    followUser={followUser}
                                    key={follow.follower.id}
                                    follower={follow}
                                  />
                                );
                              })}
                            </>
                          ) : (
                            <>
                              <div>No followers</div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </>}
                </div>
                <div className="flex items-center gap-2">
                    <span>Following</span>
                    {isFollowingLoading ? <>
                        <Loader width="30" height="30" color="black" />
                    </> : <>
                    <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-gray-600 hover:text-black hover:duration-300">{followingCount}</button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Following</DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          {followings.length !== 0 ? (
                            <>
                              {followings.map((following: Following) => {
                                return (
                                  <FollowingCard
                                    followRequestsSent={followRequestsSent}
                                    followings={myFollowings}
                                    followUser={followUser}
                                    key={following.following.id}
                                    following={following}
                                  />
                                );
                              })}
                            </>
                          ) : (
                            <>No followings</>
                          )}
                        </DialogContent>
                      </Dialog>
                    </>}
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
