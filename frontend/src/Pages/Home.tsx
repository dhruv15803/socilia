import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/usePosts'
import { Post } from '@/types';
import { useEffect, useRef, useState } from 'react';

const POSTS_LIMIT = 5;

const Home = () => {
    const [page,setPage] = useState<number>(1);
    const {posts,isLoading,noOfPages,setPosts} = usePosts(page,POSTS_LIMIT);
    const lastPostRef = useRef<HTMLDivElement>(null);


    const handleRemovePost = (postId:string) => {
        const newPosts = posts.filter((post:Post) => post.id!==postId);
        setPosts(newPosts);
    }

    useEffect(() => {
        if(page > 1 && lastPostRef.current) {
            lastPostRef.current.scrollIntoView({behavior:"smooth"});
        }
    },[page])


    if(isLoading) return (
        <>
        <div className='flex justify-center my-24 items-center'>
            <Loader height='80' width='80' color='black'/>
            <span className='text-xl font-semibold'>Loading...</span>
        </div>
        </>
    )

  return (
    <>
    <div className='flex my-12  flex-col gap-4 md:mx-[20%] lg:mx-[25%] xl:mx-[35%] 2xl:mx-[40%]'>
        {posts.length!==0 ? <>
            {posts.map((post:Post,index:number) => {
                return <div key={post.id} ref={index===posts.length-1 ? lastPostRef:null}>
                    <PostCard post={post} onRemovePost={handleRemovePost}/>
                    {(index===posts.length-1 && page < noOfPages) && <div className='flex justify-center mt-4'>
                        <Button onClick={() => setPage((prev)=>prev+1)}>{isLoading ? "Loading...":"Load more"}</Button>
                    </div>}
                </div>
            })}
        </> : <>
            <div className='flex items-center justify-center'>No Posts available</div>
        </>} 
    </div>
    </>
  )
}

export default Home;
