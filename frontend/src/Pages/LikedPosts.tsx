import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import PostCard from '@/components/PostCard';
import { useLikedPosts } from '@/hooks/useLikedPosts'
import { Post } from '@/types';
import { useState } from 'react';

const POSTS_LIMIT = 10;


const LikedPosts = () => {
    const [page,setPage] = useState<number>(1);
    const {likedPosts,isLoading,setLikedPosts,noOfPages} = useLikedPosts(undefined,page,POSTS_LIMIT);


    const handleRemovePost = (postId:string) => {
        const newPosts = likedPosts.filter((post:Post) => post.id!==postId);
        setLikedPosts(newPosts);
    }

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
        {likedPosts.map((post) => {
            return <PostCard onRemovePost={handleRemovePost} key={post.id} post={post}/>
        })}
        <Pagination noOfPages={noOfPages} pageNum={page} setPageNum={setPage}/>
    </div>
    </>
  )
}

export default LikedPosts