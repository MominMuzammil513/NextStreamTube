import prisma from "@/lib/prismaClient";
import { verifyAccessToken } from "@/lib/session";
import { Upload } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  const accessToken = req.cookies.get("accessToken");
  
  if (!accessToken) {
    return NextResponse.json({
      success: false,
      message: "Invalid access token or authentication",
    }, { status: 401 });
  }

  const userId = await verifyAccessToken(accessToken.value);
  if (!userId?.id) {
    return NextResponse.json({
      success: false,
      message: "Invalid access token or authentication",
    }, { status: 401 });
  }

  const avatarFile = formData.get("avatar") as File | null;

  if (!avatarFile) {
    return NextResponse.json({
      success: false,
      message: "Please upload the avatar image",
    }, { status: 400 });
  }

  // Validate the file type on the server side
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validImageTypes.includes(avatarFile.type)) {
    return NextResponse.json({
      success: false,
      message: "Invalid file type. Please upload an image (JPEG, PNG, or GIF).",
    }, { status: 400 });
  }

  try {
    const avatarUploadResult = await Upload(avatarFile, "nextjs-imagegallary");
    const avatarPath = avatarUploadResult?.url;
    
    const user = await prisma.user.update({
      where: { id: userId.id },
      data: { avatar: avatarPath },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Something went wrong while updating the avatar",
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating avatar:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating avatar',
      error: error.message,
    }, { status: 500 });
  }
}
