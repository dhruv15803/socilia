import { AppContext } from "@/Context/AppContext";
import { AppContextType, Follower, Following } from "@/types";
import { useContext, useState } from "react";
import blankAvatarImg from "../assets/blankAvatarImg.png";
import { useGetFollowers } from "@/hooks/useGetFollowers";
import { useGetFollowing } from "@/hooks/useGetFollowing";
import Loader from "@/components/Loader";
import { formatDate } from "@/utils";
import EditProfileDialog from "@/components/EditProfileDialog";
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
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { backendUrl } from "@/App";

const Profile = () => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const {followersCount,isLoading: isFollowersLoading,followers} = useGetFollowers();
  const {followingCount,setFollowing,setFollowingCount,isLoading: isFollowingLoading,following: followings} = useGetFollowing();
  const {toast} = useToast();


  const followUser = async (followId: string) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/follow`,
        {
          followId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if(response.data.isFollow) {
        setFollowingCount((prev) => prev+1);
        setFollowing((prevFollowing) => [...prevFollowing,{
          following:{
            email:response.data.following.email,
            id:response.data.following.id,
            user_image:response.data.following.user_image,
            username:response.data.following.username,
          }
        }]);
      } else {
        setFollowingCount((prev) => prev-1);
        const newFollowing = followings.filter((following:Following) => following.following.id!==followId);
        setFollowing(newFollowing);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Follow/unfollow user error",
        description: "Please try again",
      });
    }
  };


  return (
    <>
      <div className="my-8 flex flex-col mx-10 md:mx-[20%] lg:mx-[25%] xl:mx-[30%]">
        <div className="flex flex-col border rounded-lg p-4 gap-2">
          <div className="flex justify-between">
            <img
              className="rounded-full w-28 aspect-auto"
              src={
                loggedInUser?.user_image !== null
                  ? loggedInUser?.user_image
                  : blankAvatarImg
              }
              alt=""
            />
            <EditProfileDialog />
          </div>
          {(loggedInUser?.firstName !== null ||
            loggedInUser?.lastName !== null) && (
            <div className="flex items-center gap-1 text-xl font-semibold">
              <div>{loggedInUser?.firstName}</div>
              <div>{loggedInUser?.lastName}</div>
            </div>
          )}
          <div className="text-lg text-gray-700 font-semibold">
            @{loggedInUser?.username}
          </div>
          {loggedInUser?.bio_data !== null && (
            <div className="flex flex-wrap my-2">{loggedInUser?.bio_data}</div>
          )}
          <div className="flex items-center gap-8 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Followers</span>
                <span className="text-xl font-semibold">
                  {isFollowersLoading ? (
                    <>
                      <Loader width="30" height="30" color="black" />
                    </>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button>{followersCount}</button>
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
                                    followings={followings}
                                    followUser={followUser}
                                    key={follow.follower.id}
                                    follower={follow}
                                  />
                                );
                              })}
                            </>
                          ) : (
                            <>
                              <div>You have no followers</div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Following</span>
                <span className="text-xl font-semibold">
                  {isFollowingLoading ? (
                    <>
                      <Loader width="30" height="30" color="black" />
                    </>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button>{followingCount}</button>
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
                                    followUser={followUser}
                                    key={following.following.id}
                                    following={following}
                                  />
                                );
                              })}
                            </>
                          ) : (
                            <>You are following no one</>
                          )}
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              {formatDate(loggedInUser?.createdAt!)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
