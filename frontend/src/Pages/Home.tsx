import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import PostCard from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts'
import { Post } from '@/types';
import { useState } from 'react';

const POSTS_LIMIT = 10;

const Home = () => {
    const [page,setPage] = useState<number>(1);
    const {posts,isLoading,noOfPages,setPosts} = usePosts(page,POSTS_LIMIT);

    if(isLoading) return (
        <>
        <div className='flex justify-center my-24 items-center'>
            <Loader height='80' width='80' color='black'/>
            <span className='text-xl font-semibold'>Loading...</span>
        </div>
        </>
    )


    const handleRemovePost = (postId:string) => {
        const newPosts = posts.filter((post:Post) => post.id!==postId);
        setPosts(newPosts);
    }

  return (
    <>
    <div className='flex mt-24 flex-col gap-4 mx-8 md:mx-[20%] lg:mx-[25%] xl:mx-[35%]'>
        {posts.map((post) => {
            return <PostCard onRemovePost={handleRemovePost} key={post.id} post={post}/>
        })}
        <Pagination noOfPages={noOfPages} pageNum={page} setPageNum={setPage}/>
    </div>
    </>
  )
}

export default Home;
