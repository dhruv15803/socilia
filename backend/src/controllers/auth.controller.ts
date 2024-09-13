import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { client } from "..";
import bcrypt from 'bcrypt';

type RegisterUserRequest = {
    email:string;
    username:string;
    password:string;
}

type LoginUserRequest = {
    email:string;
    username:string;
    password:string;
}


const registerUser = async (req:Request,res:Response) =>  {
    if(req.cookies?.auth_token) return res.status(400).json({"success":false,"message":"auth_token already exists"});
    try {
        const {email,username,password} = req.body as RegisterUserRequest;
        const user = await client.user.findFirst({where:{OR:[{email:email.trim().toLowerCase()},{username:username.trim().toLowerCase()}]}});
        if(user) return res.status(400).json({"success":false,"message":"user already exists"});
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const newUser = await client.user.create({data:{email:email.trim().toLowerCase(),username:username.trim().toLowerCase(),password:hashedPassword}});
        
        const jwtToken = jwt.sign({userId:newUser.id},process.env.JWT_SECRET as string,{
            expiresIn:'1d',
        });
        return res.cookie("auth_token",jwtToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production" ? "none" : "strict",
            maxAge:1000*60*60*24,
        }).json({"success":true,"message":"User registered successfully","user":newUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when registering user"});
    }
}


const loginUser = async (req:Request,res:Response) => {
    // user can login either by username or email
    if(req.cookies?.auth_token) return res.status(400).json({"success":false,"message":"auth_token already exists"});
    try {
        const {email,password,username} = req.body as LoginUserRequest;
        let isLoginByEmail = true;
        if(email.trim()==="") {
            isLoginByEmail = false;
        }
        let incorrectCredMsg = isLoginByEmail ? "Incorrect email or password" : "Incorrect username or password";
        const user = isLoginByEmail ? await client.user.findUnique({where:{email:email.trim().toLowerCase()}}) : await client.user.findUnique({where:{username:username.trim().toLowerCase()}});

        if(!user) return res.status(400).json({"success":false,"message":incorrectCredMsg});
    
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect) return res.status(400).json({"success":false,"message":incorrectCredMsg});
    
        const jwtToken = jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{
            expiresIn:'1d',
        });
        return res.cookie("auth_token",jwtToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            maxAge:1000*60*60*24,
            sameSite:process.env.NODE_ENV==="production" ? "none" : "strict",
        }).json({"success":true,"message":"user logged in","user":user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when loggin in"});
    }
}

const logoutUser = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"invalid user"});
        return res.clearCookie("auth_token").json({"success":true,"message":"user logged out"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when logging out"});
    }
}

const getAuthenticatedUser = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await client.user.findUnique({where:{id:userId}});
        if(!user) return res.status(400).json({"success":false,"message":"invalid user id"});
        return res.status(200).json({"success":true,user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"sucess":false,"message":"Something went wrong when getting authenticated user"});
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    getAuthenticatedUser,
}