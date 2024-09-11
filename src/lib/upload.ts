"use server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  url: string;
  duration?: number; // Optional duration field for videos
}

export const Upload = async (file: File, folder: string): Promise<UploadResult> => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise<UploadResult>((resolve, reject) => {
    const resourceType: 'video' | 'image' = file.type.startsWith('video/') ? 'video' : 'image';

    const uploadOptions = {
      resource_type: resourceType,
      folder: folder,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err) {
          return reject(new Error(err.message));
        }
        if (result?.secure_url) {
          const uploadResult: UploadResult = { url: result.secure_url };

          if (resourceType === 'video' && result?.duration) {
            uploadResult.duration = result.duration;
          }

          resolve(uploadResult);
        } else {
          reject(new Error("Upload failed, no URL returned"));
        }
      }
    );

    uploadStream.end(bytes);
  });
};



// "use server"
// import cloudinary from "./cloudinary-upload";

// interface UploadResult {
//   url: string;
// }

// export const Upload = async (file: File, folder: string): Promise<UploadResult> => {
//   const buffer = await file.arrayBuffer();
//   const bytes = Buffer.from(buffer);

//   return new Promise<UploadResult>((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { resource_type: "auto", folder: folder },
//       (err, result) => {
//         if (err) {
//           return reject(new Error(err.message));
//         }
//         if (result?.secure_url) {
//           resolve({ url: result.secure_url }); // Return the URL in an object
//         } else {
//           reject(new Error("Upload failed, no URL returned"));
//         }
//       }
//     );
//     uploadStream.end(bytes);
//   });
// };
