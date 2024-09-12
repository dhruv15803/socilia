import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { Post } from '@/types';
import  { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

const POSTS_LIMIT=5;

const UserLikedPosts = () => {
  const {userId} = useParams();
  const [page,setPage] = useState<number>(1);
  const {likedPosts,isLoading,noOfPages} = useLikedPosts(userId,page,POSTS_LIMIT);
  const lastPostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page > 1 && lastPostRef.current) {
      lastPostRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page]);

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
        {likedPosts.length!==0 ? <>
          {likedPosts.map((post:Post,index) => {
          return <div key={post.id} ref={index===likedPosts.length-1 ? lastPostRef:null}>
          <PostCard key={post.id} post={post}/>
          {(index===likedPosts.length-1 && page < noOfPages) && <div className='flex items-center justify-center'>
              <Button onClick={() => setPage((prev) => prev+1)}>{isLoading ? "Loading...":"Load More"}</Button>
          </div> }
        </div>
        })}
        </> : <>
          <div className='flex items-center justify-center'>
            No Liked posts available
          </div>
        </>}
      </div>
    </>
  )
}

export default UserLikedPosts;