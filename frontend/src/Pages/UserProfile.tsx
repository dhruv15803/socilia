import Loader from "@/components/Loader";
import { useGetUser } from "@/hooks/useGetUser";
import  {useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import blankAvatarImg from "../assets/blankAvatarImg.png";
import { useGetFollowing } from "@/hooks/useGetFollowing";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { backendUrl } from "@/App";
import { useGetFollowers } from "@/hooks/useGetFollowers";
import { AppContext } from "@/Context/AppContext";
import { AppContextType, Follower, Following} from "@/types";
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

const UserProfile = () => {
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { userId } = useParams();
  if (!userId) return <>user not found</>;
  const { isLoading, user } = useGetUser(userId);
  const {followers,isLoading:isFollowersLoading,setFollowers,setFollowersCount,followersCount} = useGetFollowers(userId);
  const {following:followings,followingCount,isLoading:isFollowingLoading} = useGetFollowing(userId);
  const {following:myFollowings,setFollowing:setMyFollwings} = useGetFollowing();

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
      setIsFollowing(response.data.isFollow);
      if(response.data.isFollow) {
        setFollowersCount((prevCount) => prevCount+1);
        setFollowers((prev) => [...prev ,{
            follower:{
              email:loggedInUser?.email!,
              id:loggedInUser?.id!,
              user_image:loggedInUser?.user_image!,
              username:loggedInUser?.username!,
            }
        }]);
      } else {
        setFollowersCount((prevCount) => prevCount-1);
        const newFollowers = followers.filter((follower) => follower.follower.id!==loggedInUser?.id);
        setFollowers(newFollowers);
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
        if(response.data.isFollow) {
            setMyFollwings((prev) => [...prev , {
                following:{
                    email:response.data.following.email,
                    id:response.data.following.id,
                    user_image:response.data.following.user_image,
                    username:response.data.following.username,
                }
            }]);
        } else {
            const newMyFollowings = myFollowings.filter((following) => following.following.id!==followId);
            setMyFollwings(newMyFollowings);
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    const isFollow = followers.some((follower) => follower.follower.id === loggedInUser?.id);
    setIsFollowing(isFollow);
  }, [user, followers]);

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
      <div className="flex flex-col border rounded-lg p-4 gap-2 mt-16">
        <div className="flex justify-between">
          <img
            className="rounded-full w-28 aspect-auto"
            src={user.user_image !== null ? user.user_image : blankAvatarImg}
            alt=""
          />
          <Button
            onClick={followUserProfile}
            variant={isFollowing ? "destructive" : "default"}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
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
