import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { useFollowRequests } from "@/hooks/useFollowRequests";
import { IoIosNotificationsOutline } from "react-icons/io";
import Loader from "./Loader";
import { FollowRequests, SocketContextType } from "@/types";
import FollowRequestCard from "./FollowRequestCard";
import axios from "axios";
import { backendUrl } from "@/App";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/Context/SocketContext";

const NotificationsSheet = () => {
    const {socket} = useContext(SocketContext) as SocketContextType;
    const {followRequests,followRequestsCount,isLoading,setFollowRequests,setFollowRequestsCount} = useFollowRequests();


    const handleFollowRequest = async (senderId:string) => {
        try {
            await axios.post(`${backendUrl}/api/user/accept_follow_request`,{
                senderId,
            },{
                withCredentials:true,
            });
            setFollowRequestsCount((prev) => prev-1);
            const newRequests = followRequests.filter((followRequest:FollowRequests) => followRequest.request_sender.id !== senderId);
            setFollowRequests(newRequests);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const handleNewRequest = (newRequest:FollowRequests) => {
            setFollowRequests((prevRequests) => [...prevRequests , newRequest]);
        }

        const handleRemoveRequest = (request_sender_id:string) => {
            const newRequests = followRequests.filter((followRequest:FollowRequests) => followRequest.request_sender.id!==request_sender_id);
            setFollowRequests(newRequests);
        }

        socket?.on("sent_request",handleNewRequest);

        socket?.on("remove_request",handleRemoveRequest);
        
        return () => {
            socket?.off("sent_request",handleNewRequest);
            socket?.off("remove_request",handleRemoveRequest);
        }
    },[socket])

  return (
    <>
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="flex items-center">
                        <button className="text-3xl"><IoIosNotificationsOutline/></button>
                        <div className="border rounded-full px-2">{followRequestsCount}</div>
                    </div>
                    <span className="font-semibold hidden md:inline">Notifications</span>
                </div>
            </SheetTrigger>
            <SheetContent side={"left"}>
                {isLoading ? <>
                    <div className="flex items-center justify-center my-12">
                        <Loader width="40" height="40" color="black"/>
                    </div>
                </> : <>
                <SheetHeader>
                    <SheetTitle>Follow Requests</SheetTitle>
                    <SheetDescription>You have {followRequestsCount} follow requests</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    {followRequests.map((followRequest:FollowRequests) => {
                        return <FollowRequestCard key={followRequest.request_sender.id} followRequest={followRequest} handleFollowRequest={handleFollowRequest}/>
                    })}
                </div>
                </>}
            </SheetContent>
        </Sheet>
    </>
  )
}

export default NotificationsSheet;
