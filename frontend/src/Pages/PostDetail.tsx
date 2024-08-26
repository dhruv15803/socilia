import Loader from "@/components/Loader";
import { usePost } from "@/hooks/usePost";
import { postCreatedAt } from "@/utils";
import { useContext, useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight} from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { backendUrl } from "@/App";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const PostDetail = () => {
  const {toast} = useToast();
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const { postId } = useParams();
  if (!postId) return <>post not available</>;
  const { isLoading, post } = usePost(postId);
  const [currentImageIdx, setCurrentImageIdx] = useState<number>(0);
  const [isPostLiked,setIsPostLiked] = useState<boolean>(false);
  const [postLikesCount,setPostLikesCount] = useState<number>(0);


  const likePost = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/post/like`,
        {
          postId: post?.id,
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


  useEffect(() => {
    if(post==null) return;
    const isLiked = post?.PostLike.some((liked_by) => liked_by.liked_by_id===loggedInUser?.id);
    setIsPostLiked(isLiked);
    setPostLikesCount(post._count.PostLike);
  },[post])


  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center gap-2 mt-24">
          <Loader height="80" width="80" color="black" />
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="my-16 border flex flex-col gap-4 mx-10 md:mx-[20%] p-4 lg:mx-[25%] xl:mx-[30%]">
        <div className="flex items-center justify-between border-b p-2">
          <div className="flex items-center gap-2">
            {post?.post_author.user_image !== null ? (
              <>
                <img src={post?.post_author.user_image} alt="" />
              </>
            ) : (
              <>
                <button className="text-3xl">
                  <RxAvatar />
                </button>
              </>
            )}
            <span className="text-xl">{post?.post_author.username}</span>
          </div>
          <div className="text-xl text-gray-600">
            {postCreatedAt(post?.createdAt!)}
          </div>
        </div>
        <div className="text-xl flex flex-wrap font-semibold">{post?.post_title}</div>
        <div className="flex items-center justify-center gap-2 px-8">
          {currentImageIdx > 0 && (
            <button
              onClick={() => setCurrentImageIdx((prev) => prev - 1)}
              className="text-2xl"
            >
              <FaChevronLeft />
            </button>
          )}
          {post?.post_images.length !== 0 && (
            <>
              <img className="rounded-lg w-full aspect-auto" src={post?.post_images[currentImageIdx]} alt="" />
            </>
          )}
          {currentImageIdx < post?.post_images.length! - 1 && (
            <button className="text-2xl" onClick={() => setCurrentImageIdx((prev) => prev + 1)}>
              <FaChevronRight />
            </button>
          )}
        </div>
        {post?.post_images.length! > 1 && <div className="flex items-center gap-1 justify-center">
            {post?.post_images.map((_,idx) => {
                return <div className={`rounded-full p-1 border border-black ${currentImageIdx===idx ? 'bg-black' : ''}`} key={idx}></div>
            })}
        </div>}
        <div className="flex flex-wrap text-lg">{post?.post_content}</div>
        <div className="flex items-center p-2 border-t gap-4">
            <div className="flex items-center gap-2">
                <button className="text-2xl"><FaRegCommentAlt/></button>
                <span>{post?._count.Comment}</span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={likePost} className="text-2xl">{isPostLiked ? <AiFillLike/> : <AiOutlineLike/>}</button>
                <span>{postLikesCount}</span>
            </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
