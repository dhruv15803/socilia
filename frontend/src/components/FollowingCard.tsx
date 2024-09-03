import { AppContextType, Following, FollowRequestsSent } from '@/types'
import { RxAvatar } from 'react-icons/rx';
import { Button } from './ui/button';
import { useContext, useMemo } from 'react';
import { AppContext } from '@/Context/AppContext';

type Props = {
    following:Following;
    followUser: (followId: string) => Promise<void>;
    followings:Following[];
    followRequestsSent:FollowRequestsSent[];
}

const FollowingCard = ({following,followUser,followings,followRequestsSent}:Props) => {

  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const isFollowing = useMemo(() => followings.some((f) => f.following.id===following.following.id),[followings,following]);
  const isRequested = useMemo(() => followRequestsSent.some((followRequest:FollowRequestsSent) => followRequest.request_receiver.id===following.following.id),[followRequestsSent,following]);

  return (
    <>
    <div className='flex items-center p-2 justify-between'>
        <div className='flex items-center gap-2'>
            {following.following.user_image!==null ? <><img className='rounded-full w-12' src={following.following.user_image} alt="" /></> : <><button className='text-xl'><RxAvatar/></button></>}
            <div className='font-semibold'>{following.following.username}</div>
        </div>
        {loggedInUser?.id!==following.following.id &&  <Button onClick={() => followUser(following.following.id)} variant={isFollowing ? "destructive":"default"} >{isFollowing ? "Unfollow" : isRequested ?  "Requested" : "Follow"}</Button>}
    </div>
    </>
  )
}

export default FollowingCard;
