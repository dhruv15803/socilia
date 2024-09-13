import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { useMyPosts } from "@/hooks/useMyPosts";
import { Post } from "@/types";
import { useEffect, useRef, useState } from "react";


const POSTS_LIMIT=5;

const MyPosts = () => {
  const [page,setPage] = useState<number>(1);
  const { posts,isLoading,setPosts ,noOfPages} = useMyPosts(undefined,page,POSTS_LIMIT);
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
          {posts.map((post , index) => {
          return <div key={post.id} ref={index===posts.length-1  ?  lastPostRef : null }>
              <PostCard onRemovePost={handleRemovePost} key={post.id} post={post} />
              {(index===posts.length-1 && page < noOfPages) && <div className="flex items-center justify-center mt-4">
                  <Button onClick={() => setPage((prev) => prev+1)}>{isLoading  ? "Loading..." : "Load More"}</Button>
                </div>}
          </div>
        })}
        </> : <>
          <div className="flex items-center justify-center">
            No Posts available
          </div>
        </>}
      </div>
    </>
  );
};

export default MyPosts;
