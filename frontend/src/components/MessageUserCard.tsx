import { SocketContext } from '@/Context/SocketContext';
import { SocketContextType } from '@/types';
import { useContext, useMemo } from 'react'
import { RxAvatar } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

type Props = {
    user:{
        id:string;
        username:string;
        email:string;
        user_image:string | null;
    }
}

const MessageUserCard = ({user}:Props) => {
    const navigate = useNavigate();
    const {onlineUsers} = useContext(SocketContext) as SocketContextType;
    const isOnline = useMemo(() => onlineUsers.some((userId) => userId===user.id),[onlineUsers,user]);
    console.log(onlineUsers);

  return (
    <>
    <div onClick={() => navigate(`/chat/${user.id}`)} className='cursor-pointer flex justify-between p-2 hover:bg-gray-100 hover:duration-300'>
        <div className='flex items-center gap-2'>
            {user.user_image!==null ? <><img src={user.user_image} alt="" /></> : <><button className='text-3xl'><RxAvatar/></button></>}
            <span className='text-xl font-semibold'>{user.username}</span>
        </div>
        {isOnline && <div className='text-gray-600'>Online</div>}
    </div>
    </>
  )
}

export default MessageUserCard