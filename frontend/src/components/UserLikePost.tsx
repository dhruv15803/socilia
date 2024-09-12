import  { SetStateAction, useContext, useMemo} from "react";
import { RxAvatar } from "react-icons/rx";
import { Button } from "./ui/button";
import { AppContext } from "@/Context/AppContext";
import { AppContextType, Following, FollowRequestsSent, followUserResponse } from "@/types";
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
  setFollowing:React.Dispatch<SetStateAction<Following[]>>;
  followRequestsSent:FollowRequestsSent[];
  setFollowRequestsSent:React.Dispatch<SetStateAction<FollowRequestsSent[]>>;
};

const UserLikePost = ({ liked_by,following,followRequestsSent,setFollowing,setFollowRequestsSent}: Props) => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const {toast} = useToast();
  const isFollowed = useMemo(() => following.some((followingUser:Following) => liked_by.liked_by.id===followingUser.following.id),[following,liked_by]);
  const isRequested = useMemo(() => followRequestsSent.some((followRequest:FollowRequestsSent) => liked_by.liked_by.id===followRequest.request_receiver.id),[followRequestsSent,liked_by]);

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
      const data = response.data as followUserResponse;
      if(data.unfollowed) {
        setFollowing((prevFollowings) => prevFollowings.filter((following) => following.following.id!==followId));
      } else if (data.isRequested) {
        setFollowRequestsSent((prev) => [...prev , {request_receiver:data.newRequest?.request_receiver!}]);
      } else {
        // cancelled request
        setFollowRequestsSent((prevRequests) => prevRequests.filter((followRequest:FollowRequestsSent) => followRequest.request_receiver.id!==followId));
      }
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
              <img className="w-12 rounded-full" src={liked_by.liked_by.user_image} alt="" />
            </>
          ) : (
            <>
              <button className="text-3xl">
                <RxAvatar />
              </button>
            </>
          )}
          <span className="text-lg font-semibold">
            {liked_by.liked_by.username}
          </span>
        </div>
        {liked_by.liked_by.id !== loggedInUser?.id && <Button  variant={isFollowed ? "destructive" : isRequested ? "outline" : "default"} onClick={() => followUser(liked_by.liked_by.id)}>{isFollowed ? "Following" : isRequested ? "Requested"  : "Follow"}</Button>}
      </div>
    </>
  );
};

export default UserLikePost;
