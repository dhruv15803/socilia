import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useComments } from "@/hooks/useComments";
import Loader from "./Loader";
import CommentCard from "./CommentCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { backendUrl } from "@/App";
import { FaRegCommentAlt } from "react-icons/fa";

type Props = {
  postId: string;
  commentCount: number;
  onCommentChange: (isDelete: boolean) => void;
};

const PostCommentsDialog = ({
  postId,
  commentCount,
  onCommentChange,
}: Props) => {
  const { comments, isLoading, setComments } = useComments(postId);
  const [commentText, setCommentText] = useState<string>("");

  const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/comment/create`,
        {
          comment_text: commentText,
          post_id: postId,
        },
        {
          withCredentials: true,
        }
      );
      setComments((prevComments) => [response.data.comment, ...prevComments]);
      onCommentChange(false);
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveComment = async (commentId: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/comment/${commentId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.isDelete) {
        const newComments = comments.filter(
          (comment) => comment.id !== commentId
        );
        setComments(newComments);
        onCommentChange(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <>
        <div className="flex items-center justify-center my-4">
          <Loader width="60" height="60" color="black" />
        </div>
      </>
    );

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer text-xl text-gray-600 hover:text-black hover:duration-300">
            <button className="text-2xl">
            <FaRegCommentAlt />
            </button>
            {commentCount}
          </div>
        </DialogTrigger>
        <DialogContent className=" max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => handleCreateComment(e)}
            className="flex flex-col gap-2 my-2"
          >
            <Input
              value={commentText}
              placeholder="write comment"
              onChange={(e) => setCommentText(e.target.value)}
              type="text"
            />
            <div className="flex items-center justify-end">
              <Button>comment</Button>
            </div>
          </form>
          {comments.map((comment) => {
            return (
              <CommentCard
                onRemoveComment={handleRemoveComment}
                key={comment.id}
                comment={comment}
              />
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCommentsDialog;
