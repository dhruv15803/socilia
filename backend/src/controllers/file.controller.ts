import { Request, Response } from "express"
import { Multer } from "multer";
import { v2 as cloudinary } from "cloudinary";
import {promises as fs} from "fs"


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadFiles = async (req:Request,res:Response) => {
    try {
        if(!req.files || !Array.isArray(req.files)) return res.status(400).json({"success":false,"message":"Files not available"});
        const files = req.files as Express.Multer.File[];

        const urlsPromises = files.map(async (file) => {
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(file.path,{
                    resource_type:"auto",
                });
                const url = cloudinaryResponse.url;
                await fs.unlink(file.path);
                return url;
            } catch (error) {
                console.error(`Error uploading file ${file.originalname}: `,error);
                return res.status(400).json({"success":false,"message":"file upload error"});
            }
        });

        const urls = await Promise.all(urlsPromises);
        return res.status(200).json({"success":true,urls});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when uploading files"});
    }
}

const uploadFile = async (req:Request,res:Response) => {
    try {
        if(!req.file?.path) return res.status(400).json({"success":false,"message":"file not available"});
        const localFilePath = req.file.path;
        const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath,{
            "resource_type":"auto",
        });
    
        const url = cloudinaryResponse.url;
        await fs.unlink(localFilePath);
        return res.status(200).json({"success":true,url});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when uploading file"});
    }

}


export {
    uploadFiles,
    uploadFile,
}