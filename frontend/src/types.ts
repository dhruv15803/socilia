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

export type Post = {
    id:string;
    post_images:string[];
    post_title:string;
    post_content:string;
    post_author_id:string;
    post_author:{
        username:string;
        user_image:string | null;
        id:string;
        email:string;
    }
    createdAt:string;
    _count:{
        PostLike:number;
        Comment:number;
    },
    PostLike:{
        liked_by:{
            id:string;
            username:string;
            user_image:string | null;
            email:string;
        }
    }[];
}

export type Following = {
    following:{
        id:string;
        username:string;
        email:string;
        user_image:string | null;
    }
}

export type Follower = {
    follower:{
        id:string;
        username:string;
        email:string;
        user_image:string | null;
    }
}