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
import MessageUserCard from './MessageUserCard';

const MessagesSheet = () => {
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
                            return <MessageUserCard user={following.following} key={following.following.id} />
                        })}
                    </div>
                </>}
            </SheetContent>
        </Sheet>
    </>
  )
}

export default MessagesSheet;
