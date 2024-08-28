import { Following } from '@/types'
import { RxAvatar } from 'react-icons/rx';
import { Button } from './ui/button';

type Props = {
    following:Following;
    followUser: (followId: string) => Promise<void>;
}

const FollowingCard = ({following,followUser}:Props) => {
  return (
    <>
    <div className='flex items-center p-2 justify-between'>
        <div className='flex items-center gap-2'>
            {following.following.user_image!==null ? <><img src={following.following.user_image} alt="" /></> : <><button className='text-xl'><RxAvatar/></button></>}
            <div className='font-semibold'>{following.following.username}</div>
        </div>
        <Button onClick={() => followUser(following.following.id)} variant="destructive">Unfollow</Button>
    </div>
    </>
  )
}

export default FollowingCard;
