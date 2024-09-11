import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient'; // Adjust the import path as needed
import { verifyAccessToken } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    // Access user data from custom headers
    const accessToken = req.cookies.get("accessToken")
    if (!accessToken) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }

    const user = await verifyAccessToken(accessToken.value);
    if (!user) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }

    // Remove refresh token for the user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: null, // Set refreshToken to null to remove it
      },
    });

    // Create a response object
    const response = NextResponse.json({ message: 'User logged out successfully' }, { status: 200 });

    // Clear cookies by setting them with an expiration date in the past
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0), // Set expiration date to the past
    });
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0), // Set expiration date to the past
    });

    return response;
  } catch (error) {
    console.error('Error handling logout:', error);
    return NextResponse.json(
      { 
        message: 'Error handling logout', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }, 
      { status: 500 }
    );
  }
}
