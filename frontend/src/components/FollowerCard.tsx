import { Follower, Following } from '@/types'
import React, { useMemo } from 'react'
import { RxAvatar } from 'react-icons/rx';
import { Button } from './ui/button';

type Props = {
    follower:Follower;
    followUser: (followId: string) => Promise<void>;
    followings:Following[];
}

const FollowerCard = ({follower,followUser,followings}:Props) => {
    const isFollowing = useMemo(() => followings.some((following:Following) => following.following.id===follower.follower.id),[followings,follower]);


  return (
    <> 
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                {follower.follower.user_image!==null ? <><img src={follower.follower.user_image} alt="" /></> : <><button className='text-xl'><RxAvatar/></button></>}
                <div className='font-semibold'>{follower.follower.username}</div>
            </div>
            <Button onClick={() => followUser(follower.follower.id) }>{isFollowing ? "Following" : "Follow"}</Button>
        </div>
    </>
  )
}

export default FollowerCard;