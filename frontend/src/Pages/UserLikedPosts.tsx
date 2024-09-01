import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { Post } from '@/types';
import React from 'react'
import { useParams } from 'react-router-dom'

const UserLikedPosts = () => {
  const {userId} = useParams();
  const {likedPosts,isLoading,noOfPages} = useLikedPosts(userId);

  if(isLoading) return (
    <>
      <div className='flex items-center justify-center'>
        <Loader width='40' height='40' color='black'/>
      </div>
    </>
  )

  return (
    <>
      <div className='flex flex-col gap-4'>
        {likedPosts.map((post:Post) => {
          return <PostCard post={post} key={post.id}/>
        })}
      </div>
    </>
  )
}

export default UserLikedPosts;