
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useFollowRequestsSent } from '@/hooks/useFollowRequestsSent';
import { FollowRequestsSent, followUserResponse } from '@/types';
import FollowRequestSentCard from './FollowRequestSentCard';
import Loader from './Loader';
import axios from 'axios';
import { backendUrl } from '@/App';
import { useToast } from './ui/use-toast';

const RequestsSentDialog = () => {
    const {toast} = useToast();
    const {followRequestsSent,followRequestsSentCount,isLoading:isFollowRequestsSentLoading,setFollowRequestsSent,setFollowRequestsSentCount} = useFollowRequestsSent();    

    const followUser = async (followId:string) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/follow`,{
                followId,
            },{
                withCredentials:true,
            });
            // if unfollowed : false && !requested
            // i.e cancelled request -> remove from requests sent 
            const data = response.data as followUserResponse;
            if(!data.unfollowed  && !data.isRequested) {
                setFollowRequestsSent((prevRequestsSent) => prevRequestsSent.filter((prevRequestSent) => prevRequestSent.request_receiver.id!==followId));
                setFollowRequestsSentCount((prev) => prev-1);
            } 
        } catch (error) {
            console.log(error);
            toast({
                'title':"Cancel follow request error",
                "description":"Please try again",
            })
        }
    }

    return (
    <>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Requests Sent</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Follow Requests Sent</DialogTitle>
                    <DialogDescription>{followRequestsSentCount} Requests</DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    {isFollowRequestsSentLoading ? <>
                       <div className='flex items-center justify-center'><Loader width='60' height='60' color='black'/></div> 
                    </> : <>
                        {followRequestsSent.length!==0 ? <>
                            {followRequestsSent.map((followRequestSent:FollowRequestsSent) => {
                        return <FollowRequestSentCard cancelFollowRequest={followUser} key={followRequestSent.request_receiver.id} followRequestSent={followRequestSent} followRequestsSent={followRequestsSent}/>
                    })}
                        </> : <>
                            <div className='flex items-center justify-center'>
                                No requests sent    
                            </div> 
                        </>}
                    </>}
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default RequestsSentDialog