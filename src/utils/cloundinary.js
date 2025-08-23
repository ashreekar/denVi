import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        // if local path not present
        if (!localFilePath) return null;

        // uploading on cloudinary as our file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // file has been uploaded sucessfully
        console.log("✅ File uploaded securely 🌐", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (err) {
        fs.unlinkSync(localFilePath);//removes the locally saved temp file as the upload operation failed
        return null;
    }

}

export { uploadOnCloudinary };