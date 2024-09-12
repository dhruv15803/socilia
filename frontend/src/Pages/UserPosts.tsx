import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { useMyPosts } from '@/hooks/useMyPosts'
import { Post } from '@/types';
import  { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'


const POSTS_LIMIT=10;


const UserPosts = () => {
  const {userId} = useParams();
  const [page,setPage] = useState<number>(1);
  const {posts,noOfPages,isLoading} = useMyPosts(userId,page,POSTS_LIMIT);
  const lastPostRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if(page > 1 && lastPostRef.current) {
      lastPostRef.current.scrollIntoView({behavior:"smooth"});
    }

  },[page])

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
        {posts.length!==0  ? <>
          {posts.map((post:Post,index:number) => {
          return <div key={post.id} ref={index===posts.length-1 ? lastPostRef:null}>
            <PostCard key={post.id} post={post}/>
            {(index===posts.length-1 && page < noOfPages) && <div className='flex items-center justify-center'>
                <Button onClick={() => setPage((prev) => prev+1)}>{isLoading ? "Loading...":"Load More"}</Button>
            </div> }
          </div>
        })}
        </> : <>
          <div className='flex items-center justify-center'>
            No posts available
          </div>
        </>}
      </div>
    </>
  )
}

export default UserPosts;
