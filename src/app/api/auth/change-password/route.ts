// pages/api/change-password.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import bcrypt from 'bcrypt';
import { verifyAccessToken } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    // Validate the request data
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'Current and new passwords are required' }, { status: 400 });
    }

    // Access user data from the cookies or token
    const accessToken = req.cookies.get("accessToken");
    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'User is not authenticated' }, { status: 401 });
    }

    const user = await verifyAccessToken(accessToken.value);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User is not authenticated' }, { status: 401 });
    }

    // Check if the current password is correct
    const userInDb = await prisma.user.findUnique({ where: { id: user.id } });
    if (!userInDb || !(await bcrypt.compare(currentPassword, userInDb.password))) {
      return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true, message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ success: false, message: 'Error changing password',error: error instanceof Error ? error.message : 'Unknown error occurred'}, { status: 500 });
  }
}
