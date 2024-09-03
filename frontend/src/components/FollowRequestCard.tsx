import { FollowRequests } from '@/types'
import { RxAvatar } from 'react-icons/rx';
import { Button } from './ui/button';


type Props = {
    followRequest:FollowRequests;
    handleFollowRequest:(senderId: string) => Promise<void>;
}

const FollowRequestCard = ({followRequest,handleFollowRequest}:Props) => {
  return (
    <>
        <div className='flex items-center p-4 justify-between border-b'>
            <div className='flex items-center gap-2'>
                {followRequest.request_sender.user_image!==null ? <><img src={followRequest.request_sender.user_image} alt="" /></> : <><button className='text-2xl'><RxAvatar/></button></>}
                <span className='font-semibold text-lg'>{followRequest.request_sender.username || followRequest.request_sender.email}</span>
            </div>
            <Button onClick={() => handleFollowRequest(followRequest.request_sender.id)}>Accept</Button>
        </div>
    </>
  )
}

export default FollowRequestCard;
