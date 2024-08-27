import  { useContext, useMemo, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { Button } from "./ui/button";
import { AppContext } from "@/Context/AppContext";
import { AppContextType, Following } from "@/types";
import { backendUrl } from "@/App";
import axios from "axios";
import { useToast } from "./ui/use-toast";

type Props = {
  liked_by: {
    liked_by: {
      id: string;
      username: string;
      user_image: string | null;
      email: string;
    };
  };
  following:Following[];
};

const UserLikePost = ({ liked_by,following}: Props) => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const {toast} = useToast();
  const isFollowed = useMemo(() => following.some((followingUser:Following) => liked_by.liked_by.id===followingUser.following.id),[following,liked_by]);
  const [isFollowing,setIsFollowing] = useState<boolean>(isFollowed);


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
      response.data.isFollow ? setIsFollowing(true) : setIsFollowing(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Follow user error",
        description: "Please try again",
      });
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-between p-2"
        key={liked_by.liked_by.id}
      >
        <div className="flex items-center gap-2">
          {liked_by.liked_by.user_image !== null ? (
            <>
              <img src={liked_by.liked_by.user_image} alt="" />
            </>
          ) : (
            <>
              <button className="text-xl">
                <RxAvatar />
              </button>
            </>
          )}
          <span className="text-lg font-semibold">
            {liked_by.liked_by.username}
          </span>
        </div>
        {liked_by.liked_by.id !== loggedInUser?.id && <Button  variant={isFollowing ? "outline" :"default" } onClick={() => followUser(liked_by.liked_by.id)}>{isFollowing ? "Following" : "Follow"}</Button>}
      </div>
    </>
  );
};

export default UserLikePost;
