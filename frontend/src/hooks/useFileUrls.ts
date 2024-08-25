import { backendUrl } from "@/App";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"


export const useFileUrls = (postFiles:FileList | null,setPostFiles:React.Dispatch<SetStateAction<FileList | null>>,fileInputRef:React.RefObject<HTMLInputElement>,localStorageKey?:string) => {
    let image_urls;
    if(localStorageKey) {
        image_urls=localStorage.getItem(localStorageKey)!==null ? JSON.parse(localStorage.getItem("post_image_urls")!) : [];
    }
    const [fileUrls,setFileUrls] = useState<string[]>(image_urls);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();

    useEffect(() => {
        const fetchFileUrls = async () => {
            if(postFiles==null) return;
            if(postFiles.length > 6 || fileUrls.length + postFiles.length > 6) {
                toast({
                    title:"max no of files allowed is 6"
                })
                return;
            }
            const formData = new FormData();
            Array.from(postFiles).forEach((file) => {
                formData.append("post_files",file);
            });
            try {
                setIsLoading(true);
                const response = await axios.post(`${backendUrl}/api/file/upload`,formData,{
                    headers:{
                        "Content-Type":"multipart/form-data",
                    }
                });
                setFileUrls((prev) => [...prev,...response.data.urls]);
                setPostFiles(null);
                if(fileInputRef.current) {
                    fileInputRef.current.value="";
                }
            } catch (error) {
                console.log(error);
                toast({
                    title:"File upload error",
                    description:"Please try again",
                })
            } finally {
                setIsLoading(false);
            }
        }
        fetchFileUrls();
    },[postFiles])

    return {fileUrls,isLoading,setFileUrls};

}