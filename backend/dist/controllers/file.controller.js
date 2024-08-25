"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = require("fs");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadFiles = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files))
            return res.status(400).json({ "success": false, "message": "Files not available" });
        const files = req.files;
        const urlsPromises = files.map(async (file) => {
            try {
                const cloudinaryResponse = await cloudinary_1.v2.uploader.upload(file.path, {
                    resource_type: "auto",
                });
                const url = cloudinaryResponse.url;
                await fs_1.promises.unlink(file.path);
                return url;
            }
            catch (error) {
                console.error(`Error uploading file ${file.originalname}: `, error);
                return res.status(400).json({ "success": false, "message": "file upload error" });
            }
        });
        const urls = await Promise.all(urlsPromises);
        return res.status(200).json({ "success": true, urls });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when uploading files" });
    }
};
exports.uploadFiles = uploadFiles;
