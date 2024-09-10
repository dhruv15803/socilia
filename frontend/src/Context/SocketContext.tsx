import { createContext, useContext, useEffect, useState } from "react"
import { AppContext } from "./AppContext";
import { AppContextType, SocketContextType } from "@/types";
import { io, Socket } from "socket.io-client";
import { backendUrl } from "@/App";

export const SocketContext = createContext<SocketContextType | null>(null);

const SocketContextProvider = ({children}:{children:React.ReactNode}) => {
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const [socket,setSocket] = useState<Socket| null>(null);
    const [onlineUsers,setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        if(loggedInUser) {
            const socket = io(backendUrl , {
                query:{
                    userId:loggedInUser.id,
                }
            });
            setSocket(socket);
            socket.on("getOnlineUsers",(users) => {
                setOnlineUsers(users);
            } )
        } else {
            if(socket) {
                socket.close();
                setSocket(null);
            }
        }
    },[loggedInUser]);

    return (
        <>
            <SocketContext.Provider value={{
                socket:socket,
                onlineUsers:onlineUsers,
            }}>
                {children}
            </SocketContext.Provider>
        </>
    )
}

export default SocketContextProvider;