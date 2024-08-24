import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            userId:string;
        }
    }
}

const authenticatedUser = async (req:Request,res:Response,next:NextFunction) => {
    if(!req.cookies?.auth_token) return res.status(400).json({"success":false,"message":"no auth_token available"});
    const decoded = jwt.verify(req.cookies.auth_token,process.env.JWT_SECRET as string) as {userId:string};
    const userId = decoded.userId;
    req.userId = userId;
    next();
}


export {
    authenticatedUser,
}