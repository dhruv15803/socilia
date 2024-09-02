import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import PostCard from '@/components/PostCard';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { Post } from '@/types';
import  { useState } from 'react'
import { useParams } from 'react-router-dom'

const POSTS_LIMIT=10;

const UserLikedPosts = () => {
  const {userId} = useParams();
  const [page,setPage] = useState<number>(1);
  const {likedPosts,isLoading,noOfPages} = useLikedPosts(userId,page,POSTS_LIMIT);

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
        <Pagination noOfPages={noOfPages} pageNum={page} setPageNum={setPage}/>
      </div>
    </>
  )
}

export default UserLikedPosts;