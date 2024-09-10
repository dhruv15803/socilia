import { SetStateAction } from "react";
import { Socket } from "socket.io-client";

export type AppContextType = {
    loggedInUser:User | null;
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>;
    isLoading:boolean;
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

export type Comment = {
    id:string;
    comment_text:string;
    comment_author_id:string;
    post_id:string;
    _count:{
        CommentLike:number;
        child_comments:number;
    },
    comment_author:{
        id:string;
        username:string;
        email:string;
        user_image:string | null;
    },
    CommentLike:{
        liked_by:{
            id:string;
            username:string;
            email:string;
            user_image:string | null;
        }
    }[],
    createdAt:string;
    parent_comment:{
        comment_author:{
            id:string;
            email:string;
            username:string;
            user_image:string | null;
        }
    }
}

export type FollowRequests = {
    request_sender:{
        id:string;
        email:string;
        username:string;
        user_image:string | null;
    }
}

export type FollowRequestsSent = {
    request_receiver:{
        id:string;
        email:string;
        username:string;
        user_image:string | null;
    }
}

 export type followUserResponse = {
    success:boolean;
    message:string;
    isRequested:boolean;
    unfollowed:boolean;
    newRequest:{
        request_sender_id:string;
        request_receiver_id:string;
        request_receiver:{
            id:string;
            email:string;
            username:string;
            user_image:string | null;
        };
    } | null;
}

export type Message = {
    id:string;
    message_sender_id:string;
    message_receiver_id:string;
    message_text:string;
    conversation_id:string;
    message_images:string[];
    message_created_at:string;
    message_updated_at:string | null;
    is_edited:boolean;
}

export type SocketContextType = {
    socket:Socket | null;
    onlineUsers:string[];
}