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
import { BsThreeDots } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

type Props = {
  post: Post;
  onRemovePost:(postId:string) => void;
};

const PostCard = ({ post,onRemovePost}: Props) => {
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
  const [isRemovingPost,setIsRemovingPost] = useState<boolean>(false);

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

  const removePost = async () => {
    try {
      setIsRemovingPost(true);
      const response = await axios.delete(`${backendUrl}/api/post/delete/${post.id}`,{
        withCredentials:true,
      });
      console.log(response);
      onRemovePost(post.id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsRemovingPost(false);
    }
  }



  return (
    <>
      <div className={`border rounded-lg flex flex-col ${isRemovingPost ? "opacity-50" : ""}`}>
        <div className="flex items-center p-4 justify-between border-b">
          <div className="flex items-center gap-2">
            {post.post_author.user_image !== null ? (
              <>
                <img
                  className="w-12 rounded-full"
                  src={post.post_author.user_image}
                  alt=""
                />
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
          <div className="text-xl text-gray-600 flex flex-col gap-2">
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button><BsThreeDots /></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>post options</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  {loggedInUser?.id===post.post_author_id && <DropdownMenuItem disabled={isRemovingPost} onClick={removePost}>remove post</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span>{postCreatedAt(post.createdAt)}</span>
          </div>
        </div>
        <div
          onClick={() => navigate(`/post/${post.id}`)}
          className="hover:bg-gray-100 hover:duration-300 flex flex-col gap-2"
        >
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
