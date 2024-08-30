import { useComments } from '@/hooks/useComments'
import React, { useState } from 'react'
import Loader from './Loader';
import CommentCard from './CommentCard';
import { Comment } from '@/types';
import axios from 'axios';
import { backendUrl } from '@/App';
import { Input } from './ui/input';
import { Button } from './ui/button';

type Props = {
    postId:string;
    parentCommentId:string;
    onCommentChange:(isDelete:boolean) => void;
}

const ChildComments = ({parentCommentId,postId,onCommentChange}:Props) => {
    const [commentText,setCommentText] = useState<string>("");
    const {comments:childComments,isLoading,setComments:setChildComments} = useComments(postId,parentCommentId);
    const [isCommentSubmitting,setIsCommentSubmitting] = useState<boolean>(false);

    const handleRemoveComment = async (commentId: string) => {
        try {
          const response = await axios.delete(
            `${backendUrl}/api/comment/${commentId}`,
            {
              withCredentials: true,
            }
          );
          if (response.data.isDelete) {
            const newComments = childComments.filter(
              (comment) => comment.id !== commentId
            );
            setChildComments(newComments);
            onCommentChange(true);
          }
        } catch (error) {
          console.log(error);
        }
      };

      const handleCreateChildComment = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsCommentSubmitting(true);
            const response = await axios.post(`${backendUrl}/api/comment/create`,{
                "comment_text":commentText,
                "post_id":postId,
                "parent_comment_id":parentCommentId,
            },{
                withCredentials:true,
            });
            setCommentText("");
            setChildComments((prevComments) => [response.data.comment,...prevComments]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsCommentSubmitting(false);
        }
      }

    
    if(isLoading) return (
        <>
            <div className='flex items-center justify-center my-2'>
                <Loader height='40' width='40' color='black'/>
            </div>
        </>
    )

    return (
    <>
    <div className="flex flex-col gap-4">
        <form onSubmit={(e) => handleCreateChildComment(e)} className='flex items-center gap-2'>
            <Input value={commentText} onChange={(e) => setCommentText(e.target.value)} type='text' placeholder='write reply'/>
            <Button disabled={commentText.length==0 || isCommentSubmitting}>reply</Button>
        </form>
        {childComments.map((comment:Comment) => {
            return <CommentCard onRemoveComment={handleRemoveComment} key={comment.id} comment={comment} isChild={true}/>
        })}
    </div>
    </>
  )
}

export default ChildComments;
