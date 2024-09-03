import { AppContextType, Follower, Following, FollowRequestsSent } from '@/types'
import { useContext, useMemo } from 'react'
import { RxAvatar } from 'react-icons/rx';
import { Button } from './ui/button';
import { AppContext } from '@/Context/AppContext';

type Props = {
    follower:Follower;
    followUser: (followId: string) => Promise<void>;
    followings:Following[];
    followRequestsSent:FollowRequestsSent[];
}

const FollowerCard = ({follower,followUser,followings,followRequestsSent}:Props) => {
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const isFollowing = useMemo(() => followings.some((following:Following) => following.following.id===follower.follower.id),[followings,follower]);
    const isRequested = useMemo(() => followRequestsSent.some((followRequest:FollowRequestsSent) => followRequest.request_receiver.id===follower.follower.id),[followRequestsSent,follower]);


  return (
    <> 
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                {follower.follower.user_image!==null ? <><img className='rounded-full w-12' src={follower.follower.user_image} alt="" /></> : <><button className='text-xl'><RxAvatar/></button></>}
                <div className='font-semibold'>{follower.follower.username}</div>
            </div>
            {loggedInUser?.id!==follower.follower.id  &&  <Button onClick={() => followUser(follower.follower.id) }>{isFollowing ? "Following" : isRequested ? "Requested" : "Follow"}</Button>}
        </div>
    </>
  )
}

export default FollowerCard;