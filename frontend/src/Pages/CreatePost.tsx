import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileUrls } from "@/hooks/useFileUrls";
import { useEffect, useRef, useState } from "react";

const CreatePost = () => {
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [postFiles, setPostFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fileUrls, isLoading: isImagesLoading,setFileUrls} = useFileUrls(postFiles,setPostFiles,fileInputRef);

  const removeImage = (idx:number) => setFileUrls(fileUrls.filter((_,index) => index!==idx))

  useEffect(() => {
    localStorage.setItem("post_image_urls",JSON.stringify(fileUrls));
  },[fileUrls])

  return (
    <>
      <div className="bg-slate-50 flex flex-col mx-10 p-4 gap-8 my-16 rounded-lg shadow-md">
        <div className="text-2xl font-semibold mb-4">Create Post</div>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">Post Images</div>
          {isImagesLoading && <Loader height="40" width="40" color="black" />}
          <div className="flex flex-wrap items-center gap-2  my-2">
            {fileUrls.length !== 0 &&
              fileUrls.map((url, i) => {
                return (
                    <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center justify-end "><button onClick={() => removeImage(i)} className="text-xl border rounded-full p-2 hover:bg-gray-600 hover:text-white hover:duration-300">x</button></div>
                        <img className="w-24 rounded-lg" src={url} alt=""/>
                    </div>
                );
              })}
          </div>
          {!isImagesLoading && (
            <label
              className="border border-black bg-gray-200 font-semibold hover:bg-gray-600 hover:text-white hover:duration-300 rounded-lg p-2 w-fit"
              htmlFor="postImages"
            >
              Upload Images
            </label>
          )}
          <input
            ref={fileInputRef}
            onChange={(e) => setPostFiles(e.target.files)}
            hidden
            multiple
            type="file"
            id="postImages"
            accept="image/png,image/jpeg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xl" htmlFor="postTitle">
            Post Title
          </Label>
          <Input
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            type="text"
            id="postTitle"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xl" htmlFor="postContent">
            Post Content
          </Label>
          <Input
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            type="text"
            id="postContent"
          />
        </div>
        <div className="flex items-center justify-end">
          <Button>Create Post</Button>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
