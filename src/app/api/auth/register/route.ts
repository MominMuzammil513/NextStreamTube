import prisma from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { Upload } from "@/lib/upload";
import { generateRefreshToken } from "@/lib/userService";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const avatarFile = formData.get('avatar') as File | null;
    const coverImageFile = formData.get('coverImage') as File | null;

    // Validate the required fields
    if (![fullName, email, username, password].every(field => field?.trim())) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User with email or username already exists' }, { status: 409 });
    }

    // Upload avatar and cover image
    const avatarUploadResult = avatarFile ? await Upload(avatarFile, "nextjs-imagegallary") : null;
    const avatarPath = avatarUploadResult?.url || '';

    const coverImageUploadResult = coverImageFile ? await Upload(coverImageFile, "nextjs-imagegallary") : null;
    const coverImagePath = coverImageUploadResult?.url || '';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        fullName,
        username: username.toLowerCase(),
        email,
        password: hashedPassword,
        avatar: avatarPath,
        coverImage: coverImagePath,
      },
    });
    const refreshToken = generateRefreshToken(user);

    // Update the user record with the refresh token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({ success: true, message: 'User registered successfully', data: userWithoutPassword }, { status: 201 });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json({ success: false, message: 'Error registering user', error: error.message }, { status: 500 });
  }
}




// import { Upload } from "@/lib/upload"
// import { NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const name = formData.get('fullName');
//     const email = formData.get('email');
//     const username = formData.get('username');
//     const password = formData.get('password');
//     const avatar = formData.get('avatar') as File;
//     const coverImage = formData.get('coverImage') as File;
//     const video = formData.get('video') as File;

//     const avatarPath = avatar ? await Upload(avatar, "nextjs-imagegallary") : null;
//     const coverImagePath = coverImage ? await Upload(coverImage, "nextjs-imagegallary") : null;
//     const videoPath = video ? await Upload(video, "nextjs-videogallary") : null;

//     return NextResponse.json({
//       name, 
//       email, 
//       username, 
//       password, 
//       avatarPath, 
//       coverImagePath, 
//       videoPath
//     }, { status: 200 });
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
//   }
// }
