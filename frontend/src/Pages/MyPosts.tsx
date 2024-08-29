import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import { useMyPosts } from "@/hooks/useMyPosts";
import { Post } from "@/types";


const MyPosts = () => {
  const { posts, isLoading,setPosts } = useMyPosts();

  const handleRemovePost = (postId:string) => {
    const newPosts = posts.filter((post:Post) => post.id!==postId);
    setPosts(newPosts);
  }


  if (isLoading) {
    return (
      <>
        <div className="flex justify-center my-4 items-center">
          <Loader height="60" width="60" color="black" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {posts.map((post) => {
          return <PostCard onRemovePost={handleRemovePost} key={post.id} post={post} />;
        })}
      </div>
    </>
  );
};

export default MyPosts;
