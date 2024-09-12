import { Post } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserLikePost from "./UserLikePost";
import { useGetFollowing } from "@/hooks/useGetFollowing";
import { useFollowRequestsSent } from "@/hooks/useFollowRequestsSent";
import Loader from "./Loader";

type Props = {
  post: Post;
  postLikesCount: number;
};

const PostLikesDialogBox = ({ post, postLikesCount }: Props) => {

    const {following,isLoading:isFollowingLoading , setFollowing} = useGetFollowing(); 
    const {followRequestsSent,isLoading:isFollowRequestsSentLoading,setFollowRequestsSent} = useFollowRequestsSent();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <span className="cursor-pointer text-xl text-gray-600 hover:text-black hover:duration-300">{postLikesCount}</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Likes</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {(isFollowingLoading || isFollowRequestsSentLoading) ? <>
            <div className="flex justify-center my-4">
                <Loader width="60" height="60" color="black"/>
            </div>
          </> : <>
          {post?.PostLike.map((liked_by) => {
            return <UserLikePost setFollowing={setFollowing} setFollowRequestsSent={setFollowRequestsSent} followRequestsSent={followRequestsSent} key={liked_by.liked_by.id} following={following} liked_by={liked_by}/>;
          })}
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostLikesDialogBox;
