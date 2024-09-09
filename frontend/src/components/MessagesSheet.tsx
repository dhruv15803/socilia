import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { useGetFollowing } from '@/hooks/useGetFollowing';
import { FiMessageSquare } from 'react-icons/fi';
import Loader from './Loader';
import { RxAvatar } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

const MessagesSheet = () => {
    const navigate = useNavigate();
    const {following:followings,isLoading:isFollowingLoading} = useGetFollowing();


  return (
    <>
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex items-center gap-4 cursor-pointer">
                    <button className="text-xl"><FiMessageSquare/></button>
                    <span className="font-semibold">Messages</span>
                </div>
            </SheetTrigger>
            <SheetContent side={"left"}>
                <SheetHeader>
                    <SheetTitle>Message your followings</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                {isFollowingLoading ? <>
                    <div className='flex items-center justify-center my-4'>
                        <Loader width='40' height='40' color='black'/>
                    </div>
                </> : <>
                    <div className='flex flex-col gap-4'>
                        {followings.map((following) => {
                            return <div onClick={() => navigate(`/chat/${following.following.id}`)} key={following.following.id} className='cursor-pointer flex gap-2 p-2 hover:bg-gray-100 hover:duration-300'>
                                {following.following.user_image!==null ? <><img src={following.following.user_image} alt="" /></> : <><button className='text-3xl'><RxAvatar/></button></>}
                                <span className='text-xl font-semibold'>{following.following.username}</span>
                            </div>
                        })}
                    </div>
                </>}
            </SheetContent>
        </Sheet>
    </>
  )
}

export default MessagesSheet;
