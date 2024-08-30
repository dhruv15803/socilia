import { useComments } from '@/hooks/useComments'
import React from 'react'
import Loader from './Loader';
import CommentCard from './CommentCard';
import { Comment } from '@/types';
import axios from 'axios';
import { backendUrl } from '@/App';

type Props = {
    postId:string;
    parentCommentId:string;
    onCommentChange:(isDelete:boolean) => void;
}

const ChildComments = ({parentCommentId,postId,onCommentChange}:Props) => {

    const {comments:childComments,isLoading,setComments:setChildComments} = useComments(postId,parentCommentId);

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

    
    if(isLoading) return (
        <>
            <div className='flex items-center justify-center my-2'>
                <Loader height='40' width='40' color='black'/>
            </div>
        </>
    )

    return (
    <>
    <div className="flex flex-col mx-8 gap-4">
        {childComments.map((comment:Comment) => {
            return <CommentCard onRemoveComment={handleRemoveComment} key={comment.id} comment={comment}/>
        })}
    </div>
    </>
  )
}

export default ChildComments;
