import { FollowRequestsSent } from '@/types'
import { useMemo } from 'react'
import { Button } from './ui/button';
import { RxAvatar } from 'react-icons/rx';


type Props = {
    followRequestSent:FollowRequestsSent;
    followRequestsSent:FollowRequestsSent[];
    cancelFollowRequest:(receiver_id:string) => Promise<void>;
}

const FollowRequestSentCard = ({followRequestSent,followRequestsSent,cancelFollowRequest}:Props) => {

    const isRequested = useMemo(() => followRequestsSent.some((requestSent:FollowRequestsSent) => followRequestSent.request_receiver.id===requestSent.request_receiver.id),[followRequestSent,followRequestsSent]);

  return (
    <>
    <div className='flex justify-between p-2 hover:bg-gray-100' key={followRequestSent.request_receiver.id}>
         <div className='flex items-center gap-2'>
            {followRequestSent.request_receiver.user_image!==null ? <><img className='w-12 rounded-full' src={followRequestSent.request_receiver.user_image} alt="" /></> : <><button className='text-3xl'><RxAvatar/></button></>}
            <span className='text-xl font-semibold'>{followRequestSent.request_receiver.username}</span>
        </div>
        <Button onClick={() => cancelFollowRequest(followRequestSent.request_receiver.id)}>{isRequested ? "Requested" : "Follow"}</Button>
    </div>        
    </>
  )
}

export default FollowRequestSentCard;
