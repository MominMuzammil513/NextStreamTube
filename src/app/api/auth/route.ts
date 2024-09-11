import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken, generateRefreshToken, validateRefreshToken } from '@/lib/userService';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get cookies from request
    const cookieStore = cookies();
    const refreshTokenCookie = cookieStore.get('refreshToken');

    // Check if the cookie exists and has a value
    const refreshToken = refreshTokenCookie?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token not found' }, { status: 401 });
    }

    // Validate the refresh token
    const user = await validateRefreshToken(refreshToken);

    if (!user) {
      return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set new tokens in cookies (using headers to set cookies)
    const response = NextResponse.json({ accessToken: newAccessToken, refreshToken: newRefreshToken }, { status: 200 });

    // Set cookies in response headers
    response.headers.set('accessToken', `accessToken=${newAccessToken}; HttpOnly; Path=/; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax`);
    response.headers.set('refreshToken', `refreshToken=${newRefreshToken}; HttpOnly; Path=/; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax`);

    return response;
  } catch (error) {
    console.error('Error handling login:', error);
    return NextResponse.json({ message: 'Error handling login', error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
  }
}
