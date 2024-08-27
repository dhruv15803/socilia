import { AppContextType, Post } from "@/types";
import { postCreatedAt } from "@/utils";
import { useContext, useMemo, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import axios from "axios";
import { backendUrl } from "@/App";
import { useToast } from "./ui/use-toast";
import { AppContext } from "@/Context/AppContext";
import { useNavigate } from "react-router-dom";

type Props = {
  post: Post;
};

const PostCard = ({ post }: Props) => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const isLiked = useMemo(() => {
    return post.PostLike.some(
      (liked_by) => liked_by.liked_by.id === loggedInUser?.id
    );
  }, [post, loggedInUser]);
  const { toast } = useToast();
  const [isPostLiked, setIsPostLiked] = useState<boolean>(isLiked);
  const [postLikesCount, setPostLikesCount] = useState<number>(
    post._count.PostLike
  );

  const likePost = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/post/like`,
        {
          postId: post.id,
        },
        {
          withCredentials: true,
        }
      );
      setIsPostLiked(response.data.isLiked);
      response.data.isLiked
        ? setPostLikesCount((prev) => prev + 1)
        : setPostLikesCount((prev) => prev - 1);
    } catch (error) {
      console.log(error);
      toast({
        title: "post like error",
        description: "please try again",
      });
    }
  };

  return (
    <>
      <div className="border rounded-lg flex flex-col">
        <div className="flex items-center p-4 justify-between border-b">
          <div className="flex items-center gap-2">
            {post.post_author.user_image !== null ? (
              <>
                <img src={post.post_author.user_image} alt="" />
              </>
            ) : (
              <>
                <button className="text-3xl">
                  <RxAvatar />
                </button>
              </>
            )}
            <span className="text-xl">{post.post_author.username}</span>
          </div>
          <div className="text-xl text-gray-600">
            {postCreatedAt(post.createdAt)}
          </div>
        </div>
        <div onClick={() => navigate(`/post/${post.id}`)} className="hover:bg-gray-100 hover:duration-300 flex flex-col gap-2">
          <div className="flex flex-wrap text-xl font-semibold p-4">
            {post.post_title}
          </div>
          {post.post_images.length !== 0 && (
            <div className="flex items-center justify-center gap-2 px-8">
              <img
                className="rounded-lg w-full aspect-auto"
                src={post.post_images[0]}
                alt=""
              />
            </div>
          )}
          <div className="flex flex-wrap my-2 p-4 ">
            {post.post_content.length > 200
              ? post.post_content.slice(0, 200) + "..."
              : post.post_content}
          </div>
        </div>
        <div className="flex items-center gap-4 border-t p-4 ">
          <div className="flex items-center gap-2">
            <button className="text-2xl">
              <FaRegCommentAlt />
            </button>
            <span>{post._count.Comment}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={likePost} className="text-2xl">
              {isPostLiked ? <AiFillLike /> : <AiOutlineLike />}
            </button>
            <span>{postLikesCount}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
