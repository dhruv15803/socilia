import { AppContext } from "@/Context/AppContext";
import { AppContextType, Comment } from "@/types";
import { postCreatedAt } from "@/utils";
import { useContext, useEffect, useMemo, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import axios from "axios";
import { backendUrl } from "@/App";

type Props = {
  comment: Comment;
  onRemoveComment:(commentId:string) => Promise<void>;
};

const CommentCard = ({ comment,onRemoveComment}: Props) => {
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const liked = useMemo(() => comment.CommentLike.some((liked_by) => liked_by.liked_by.id===loggedInUser?.id), [comment,loggedInUser]);
    const [isLiked,setIsLiked] = useState<boolean>(false);
    const [likeCount,setLikeCount] = useState<number>(comment._count.CommentLike);

    const likeComment = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/comment/like`,{
                "commentId":comment.id,
            },{
                withCredentials:true,
            });
            setIsLiked(response.data.isLiked);
            response.data.isLiked ? setLikeCount((prev) => prev+1) : setLikeCount((prev) => prev-1);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => setIsLiked(liked),[liked])

  return (
    <>
      <div className="flex flex-col gap-2 border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {comment.comment_author.user_image !== null ? (
              <>
                <img className="w-12 rounded-full" src={comment.comment_author.user_image} alt="" />
              </>
            ) : (
              <>
                <button className="text-3xl">
                  <RxAvatar />
                </button>
              </>
            )}
            <span className="font-semibold text-xl">
              {comment.comment_author.username}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <BsThreeDots/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>comment options</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {loggedInUser?.id===comment.comment_author_id && <DropdownMenuItem onClick={() => onRemoveComment(comment.id)}>remove comment</DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <span>{postCreatedAt(comment.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center flex-wrap">
          {comment.comment_text}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={likeComment} className="text-2xl">
            {isLiked ? <AiFillLike/> : <AiOutlineLike />}
          </button>
          <span>{likeCount}</span>
        </div>
      </div>
    </>
  );
};

export default CommentCard;
