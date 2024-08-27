import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts'

const Home = () => {
    const {posts,isLoading,noOfPages} = usePosts();

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
    <div className='flex mt-12 flex-col gap-4 mx-8 md:mx-[20%] lg:mx-[25%] xl:mx-[35%]'>
        {posts.map((post) => {
            return <PostCard key={post.id} post={post}/>
        })}
    </div>
    </>
  )
}

export default Home;
