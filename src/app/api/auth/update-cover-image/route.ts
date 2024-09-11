import prisma from "@/lib/prismaClient";
import { verifyAccessToken } from "@/lib/session";
import { Upload } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  const accessToken = req.cookies.get("accessToken");
  if (!accessToken)
    return NextResponse.json({
      success: false,
      message: "In Valid Access Token Or Invalid authentication",
    });
  const userId = await verifyAccessToken(accessToken.value);
  const coverImageFile = formData.get("coverImage") as File | null;
  if (!coverImageFile)
    return NextResponse.json({
      success: false,
      message: "Please Upload the coverImage image",
    });
  const coverImageUploadResult = await Upload(coverImageFile, "nextjs-imagegallary");
  const coverImagePath = coverImageUploadResult?.url;
  const user = await prisma.user.update({
    where: { id: userId?.id },
    data: { coverImage: coverImagePath },
  });
  if (!user)
    return NextResponse.json(
      {
        success: false,
        message: "something went wrong while updating the coverImage",
      },
      { status: 403 }
    );
  return NextResponse.json(
    { success: true, message: "coverImage updated successfully" },
    { status: 200 }
  );
}
