import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import PostCard from '@/components/PostCard';
import { useMyPosts } from '@/hooks/useMyPosts'
import { Post } from '@/types';
import  { useState } from 'react'
import { useParams } from 'react-router-dom'


const POSTS_LIMIT=10;


const UserPosts = () => {
  const {userId} = useParams();
  const [page,setPage] = useState<number>(1);
  const {posts,noOfPages,isLoading} = useMyPosts(userId,page,POSTS_LIMIT);



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
        <Pagination noOfPages={noOfPages} pageNum={page} setPageNum={setPage}/>
      </div>
    </>
  )
}

export default UserPosts;
