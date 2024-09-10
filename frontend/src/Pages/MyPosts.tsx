import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { useMyPosts } from "@/hooks/useMyPosts";
import { Post } from "@/types";
import { useState } from "react";


const POSTS_LIMIT=10;

const MyPosts = () => {
  const [page,setPage] = useState<number>(1);
  const { posts,isLoading,setPosts ,noOfPages} = useMyPosts(undefined,page,POSTS_LIMIT);

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
        {posts.length!==0 ? <>
          {posts.map((post) => {
          return <PostCard onRemovePost={handleRemovePost} key={post.id} post={post} />;
        })}
        </> : <>
          <div className="flex items-center justify-center">
            No Posts available
          </div>
        </>}
        {noOfPages > 1 && <Pagination noOfPages={noOfPages} pageNum={page} setPageNum={setPage}/>}
      </div>
    </>
  );
};

export default MyPosts;
