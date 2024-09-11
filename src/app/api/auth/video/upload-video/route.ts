import prisma from "@/lib/prismaClient";
import { verifyAccessToken } from "@/lib/session";
import { Upload } from "@/lib/upload";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const accessToken = cookies().get("accessToken")?.value
        if (!accessToken) return NextResponse.json({message:"Unauthorized USer"},{status: 401})
            const verifyAccess= await verifyAccessToken(accessToken)
        if (!verifyAccess) return NextResponse.json({message:"access token expired"},{status: 401})
        const ownerId = verifyAccess.id as string;
        // Extract files
        const videoFile = formData.get("videoFile") as File | null;
        const thumbnail = formData.get("thumbnail") as File | null;
        
        // Extract other fields
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const isPublished = formData.get("isPublished") === "true";
        const isFeatured = formData.get("isFeatured") === "true";
        const category = formData.get("category") as string || "";
        const tags = (formData.get("tags") as string)?.split(",") || [];

        if (!videoFile || !title || !description || !thumbnail || !ownerId) {
            return NextResponse.json({message:"Missing required fields"}, { status: 400 });
        }

        // Upload files
        const videoUploadResult = await Upload(videoFile, "nextjs-view-tube-videos");
        const videoPath = videoUploadResult?.url;

        const thumbnailUploadResult = await Upload(thumbnail, "nextjs-view-tube-thumbnails");
        const thumbnailPath = thumbnailUploadResult?.url;
        // Create video record in the database
        const video = await prisma.video.create({
            data: {
                videoFile: videoPath || "",
                thumbnail: thumbnailPath || "",
                title,
                description,
                duration:videoUploadResult.duration || 0,
                isPublished,
                isFeatured,
                category,
                tags,
                ownerId,
            }
        });

        return NextResponse.json({video:JSON.stringify(video),videoResult:video,message:"successfully uploaded"}, { status: 201 });

    } catch (error) {
        console.error("Error uploading video:", error);
        return NextResponse.json({message:"Internal Server Error"}, { status: 500 });
    }
}
