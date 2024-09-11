// pages/api/update-account.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { verifyAccessToken } from '@/lib/session';

export async function PATCH(req: NextRequest) {
  try {
    const { email, username, fullName } = await req.json();

    // Access user data from the cookies or token
    const accessToken = req.cookies.get("accessToken");
    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'User is not authenticated' }, { status: 401 });
    }

    // Verify the token and get the user id and email from the token
    const tokenPayload = await verifyAccessToken(accessToken.value);
    if (!tokenPayload) {
      return NextResponse.json({ success: false, message: 'User is not authenticated' }, { status: 401 });
    }

    // Fetch the full user data (including username) from the database using the user id
    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.id },
      select: { id: true, email: true, username: true, fullName: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Prepare the data for updating (only include fields that were provided)
    const updatedData: any = {};
    if (email) updatedData.email = email;
    if (username) updatedData.username = username.toLowerCase();
    if (fullName) updatedData.fullName = fullName;

    // Check if the email or username is already taken by another user
    if (email || username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email && email !== user.email ? email : undefined },
            { username: username && username !== user.username ? username.toLowerCase() : undefined },
          ],
          NOT: { id: user.id }, // Exclude the current user
        },
      });

      if (existingUser) {
        return NextResponse.json({ success: false, message: 'Email or username is already taken' }, { status: 409 });
      }
    }

    // Update the user details in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updatedData,
    });

    return NextResponse.json({
      success: true,
      message: 'User account updated successfully',
      data: updatedUser,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user account:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating user account',
      error: error.message,
    }, { status: 500 });
  }
}
