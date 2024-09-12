import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { useLikedPosts } from '@/hooks/useLikedPosts'
import { Post } from '@/types';
import { useEffect, useRef, useState } from 'react';

const POSTS_LIMIT = 10;


const LikedPosts = () => {
    const [page,setPage] = useState<number>(1);
    const {likedPosts,isLoading,setLikedPosts,noOfPages} = useLikedPosts(undefined,page,POSTS_LIMIT);
    const lastPostRef = useRef<HTMLDivElement>(null);


    const handleRemovePost = (postId:string) => {
        const newPosts = likedPosts.filter((post:Post) => post.id!==postId);
        setLikedPosts(newPosts);
    }    

    useEffect(() => {
        if(page > 1 && lastPostRef.current) {
            lastPostRef.current.scrollIntoView({behavior:"smooth"});
        }
    },[page])

    if(isLoading) return (
        <>
        <div className='flex my-4 justify-center'>
            <Loader height='30' width='30'color='black'/>
        </div>
        </>
    )

    return (
    <>
    <div className='flex flex-col gap-4'>
        {likedPosts.length!==0 ? <>
            {likedPosts.map((post,index) => {
            return <div key={post.id} ref={index===likedPosts.length-1 ? lastPostRef : null}>
                <PostCard onRemovePost={handleRemovePost} key={post.id} post={post}/>
                {(index===likedPosts.length-1 && page < noOfPages) && <div className='flex items-center justify-center mt-4'>
                        <Button onClick={() => setPage((prev) => prev+1)}>{isLoading ? "Loading...":"Load More"}</Button>
                    </div>}
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

export default LikedPosts