import { useContext , useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Loader from "./Loader";
import { useFileUrl } from "@/hooks/useFileUrl";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import blankAvatarImg from "../assets/blankAvatarImg.png";
import axios from "axios";
import { backendUrl } from "@/App";

const EditProfileDialog = () => {
  const { loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;
  const [imgFile, setImgFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fileUrl, isLoading: isImgLoading,setFileUrl} = useFileUrl(imgFile,setImgFile,fileInputRef);
  const [firstName, setFirstName] = useState<string>(
    loggedInUser?.firstName || ""
  );
  const [lastName, setLastName] = useState<string>(
    loggedInUser?.lastName || ""
  );
  const [bioData, setBioData] = useState<string>(loggedInUser?.bio_data || "");
  const displayImgUrl=fileUrl || loggedInUser?.user_image || blankAvatarImg;


  const editProfile = async () => {
    try {
        const response = await axios.put(`${backendUrl}/api/user/edit`,{
            "imgUrl":fileUrl || loggedInUser?.user_image || "",
            firstName,
            lastName,
            bioData,
        },{
            withCredentials:true,
        });
        console.log(response);
        setFileUrl("");
        setLoggedInUser(response.data.newUser);
    } catch (error) {
        console.log(error);
    }
  }

  const handleRemoveFile = () => {
    setFileUrl("");
    setImgFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value="";
    }
  }


  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {isImgLoading ? (
                <>
                  <Loader width="40" height="40" color="black" />
                </>
              ) : (
                <>
                  <img
                    className="rounded-full w-16"
                    src={
                      fileUrl !== ""
                        ? fileUrl
                        : loggedInUser?.user_image !== null
                        ? loggedInUser?.user_image
                        : blankAvatarImg
                    }
                    alt=""
                  />
                </>
              )}
              <div className="flex items-center gap-2">
                <label
                  className="border px-4 py-2 rounded-lg w-fit border-black hover:bg-gray-100 hover:duration-300 "
                  htmlFor="profileImg"
                >
                  Upload
                </label>
                {displayImgUrl!==blankAvatarImg && <Button onClick={handleRemoveFile} variant="destructive">Remove image</Button>}
              </div>
              <input
                hidden
                onChange={(e) =>
                  setImgFile(e.target.files ? e.target.files[0] : null)
                }
                ref={fileInputRef}
                id="profileImg"
                type="file"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                id="firstName"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                id="lastName"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bioData">Bio</Label>
              <Input
                value={bioData}
                onChange={(e) => setBioData(e.target.value)}
                type="text"
                id="bioData"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button disabled={isImgLoading} type="submit" onClick={editProfile}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileDialog;
