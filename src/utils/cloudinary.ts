import fs from "fs";
import {UploadApiResponse, UploadApiErrorResponse, UploadApiOptions } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Define possible file types
type FileType = "image" | "video" | "auto";

// Update UploadOptions interface to extend Cloudinary's UploadApiOptions
interface CustomUploadOptions extends UploadApiOptions {
    resource_type: "image" | "video" | "auto" | "raw";
    audio_codec?: string;
    video_codec?: string;
}

const uploadOnCloudinary = async (localFilePath: string, fileType: FileType): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null;

        let uploadOptions: CustomUploadOptions = {
            resource_type: "auto",
        };

        // If it's a video, ensure audio is included
        if (fileType === "video") {
            uploadOptions = {
                ...uploadOptions,
                resource_type: "video",
                audio_codec: "aac", // Specify audio codec
                video_codec: "auto", // Let Cloudinary choose the best video codec
            };
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

        // Delete the local file after successful upload
        // fs.unlinkSync(localFilePath);

        console.log("File successfully uploaded on Cloudinary", response.url);
        return response;

    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            // fs.unlinkSync(localFilePath);
        }
        console.error("Failed to upload file on Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary };
