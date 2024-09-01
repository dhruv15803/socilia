import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { useMyPosts } from '@/hooks/useMyPosts'
import { Post } from '@/types';
import React from 'react'
import { useParams } from 'react-router-dom'

const UserPosts = () => {
  const {userId} = useParams();
  const {posts,noOfPages,isLoading} = useMyPosts(userId);




  if(isLoading) return (
    <>
      <div className='flex items-center justify-center my-4'>
        <Loader height='30' width='30' color='black'/>
      </div>
    </>
  )

  return (
    <>
      <div className='flex flex-col gap-4'>
        {posts.map((post:Post) => {
          return <PostCard key={post.id} post={post}/>
        })}
      </div>
    </>
  )
}

export default UserPosts