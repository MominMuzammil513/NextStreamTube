import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken, validateRefreshToken,generateRefreshToken } from '@/lib/userService';
import prisma from '@/lib/prismaClient';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token not found' }, { status: 401 });
    }

    // Validate the refresh token
    const user = await validateRefreshToken(refreshToken);
    if (!user) {
      return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Optionally: Generate new refresh token
    const newRefreshToken = generateRefreshToken(user);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    const response = NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    // Set the new access and refresh tokens in cookies
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Error refreshing token', error: error instanceof Error ? error.message : 'Unknown error occurred'  }, { status: 500 });
  }
}
