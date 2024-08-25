import { SetStateAction } from "react";

export type AppContextType = {
    loggedInUser:User | null;
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>;
}


export type User = {
    id:string;
    email:string;
    username:string;
    password:string;
    firstName?:string;
    lastName?:string;
    user_image?:string;
    createdAt:string;
    bio_data?:string;
    updatedAt?:string;
}


