import { backendUrl } from "@/App";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react"

export const useFileUrl = (imgFile:File | null,setImgFile:React.Dispatch<SetStateAction<File | null>>,fileInputRef:React.RefObject<HTMLInputElement>) => {
    const [fileUrl,setFileUrl] = useState<string>("");
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();

    useEffect(() => {
        const fetchFileUrl = async () => {
            if(imgFile==null) return;
            const formData = new FormData();
            formData.append("img_file",imgFile);
            try {
                setIsLoading(true);
                const response = await axios.post(`${backendUrl}/api/file/upload_single`,formData,{
                    headers:{
                        "Content-Type":"multipart/form-data",
                    }
                });
                setFileUrl(response.data.url);
                setImgFile(null);
                if(fileInputRef && fileInputRef.current) {
                    fileInputRef.current.value="";
                }
            } catch (error) {
                console.log(error);
                toast({
                    "title":"image file error",
                    description:"Please try again",
                })
            } finally {
                setIsLoading(false);
            }
        }
        fetchFileUrl();
    },[imgFile])

    return {fileUrl,isLoading,setFileUrl};
}