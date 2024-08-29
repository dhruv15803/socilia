import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { useLikedPosts } from '@/hooks/useLikedPosts'
import { Post } from '@/types';

const LikedPosts = () => {
    const {likedPosts,isLoading,setLikedPosts} = useLikedPosts();


    console.log(likedPosts);

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
    </div>
    </>
  )
}

export default LikedPosts