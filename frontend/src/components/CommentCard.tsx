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
import ChildComments from "./ChildComments";

type Props = {
  comment: Comment;
  onRemoveComment:(commentId:string) => Promise<void>;
  isChild?:boolean;
};

const CommentCard = ({ comment,onRemoveComment,isChild=false}: Props) => {
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const liked = useMemo(() => comment.CommentLike.some((liked_by) => liked_by.liked_by.id===loggedInUser?.id), [comment,loggedInUser]);
    const [isLiked,setIsLiked] = useState<boolean>(false);
    const [likeCount,setLikeCount] = useState<number>(comment._count.CommentLike);
    const [isViewReplies,setIsViewReplies] = useState<boolean>(false);
    const [repliesCount,setRepliesCount] = useState<number>(comment._count.child_comments);

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
      <div className={`flex flex-col gap-2 border-b p-2 ${isChild ? "ml-2 relative" : ""}`}>
        {isChild && (
        <div className="absolute left-0 top-0 w-6 h-full border-l-2 border-gray-300"></div>
        )}
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
        {comment.parent_comment && <div className="flex flex-wrap items-center text-gray-600">{`Replying to @${comment.parent_comment.comment_author.username}`}</div>}
        <div className="flex items-center flex-wrap">
          {comment.comment_text}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={likeComment} className="text-2xl">
              {isLiked ? <AiFillLike/> : <AiOutlineLike/>}
            </button>
            <span>{likeCount}</span>
          </div>
          <div onClick={() => setIsViewReplies((prev) => !prev)} className="cursor-pointer flex items-center gap-1">
            {isViewReplies ? `Hide replies` : repliesCount > 0 ? `Show ${repliesCount} replies` : "Reply"}
          </div>
        </div>
        {isViewReplies && <ChildComments onCommentChange={(isDelete:boolean) => isDelete ? setRepliesCount((prev) => prev-1) : setRepliesCount((prev) => prev+1)} postId={comment.post_id} parentCommentId={comment.id}/>}
      </div>
    </>
  );
};

export default CommentCard;
