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

const deleteOnCloudinary = async (fileUrl) => {
    try {
        if (!fileUrl) return null;

        // remove query params if any
        const cleanUrl = fileUrl.split("?")[0];

        // take the part after /upload/
        const parts = cleanUrl.split("/upload/")[1];

        // remove the version number (starts with 'v123...')
        const withoutVersion = parts.substring(parts.indexOf("/") + 1);

        // strip extension (.jpg, .png, etc.)
        const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

        const deletedKey = await cloudinary.uploader.destroy(publicId);
        console.log("✅ File deleted securely 🌐", deletedKey);
        return deletedKey;

    } catch (err) {
        console.error("❌ Error deleting file from Cloudinary:", err);
        return null;
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };