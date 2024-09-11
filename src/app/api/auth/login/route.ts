// import { NextRequest, NextResponse } from 'next/server';
// import { comparePassword, generateAccessToken, findUserByEmailOrUsername, generateRefreshToken } from '@/lib/userService';
// import prisma from '@/lib/prismaClient';
// import { cookies } from 'next/headers';

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const cookie = cookies();
//     const identifier = formData.get('identifier') as string; // Could be email or username
//     const password = formData.get('password') as string;

//     if (!identifier || !password) {
//       return NextResponse.json({ message: 'Identifier and password are required' }, { status: 400 });
//     }

//     const user = await findUserByEmailOrUsername(identifier);

//     if (!user || !(await comparePassword(password, user.password))) {
//       return NextResponse.json({ message: 'Invalid identifier or password' }, { status: 401 });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     // Set the cookies with the resolved token strings
//     if (accessToken) {
//       cookie.set('accessToken', accessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // Adjust as needed
//         sameSite: 'lax',
//         path: '/', // Set the path where the cookie is accessible
//         maxAge: 60 * 60, // 1 hour expiration for access token
//       });
//     }

//     if (refreshToken) {
//       cookie.set('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // Adjust as needed
//         sameSite: 'lax',
//         path: '/', // Set the path where the cookie is accessible
//         maxAge: 60 * 60 * 24 * 7, // 7 days expiration for refresh token
//       });
//     }

//     // Retrieve user without sensitive fields
//     const { password: _, refreshToken: __, ...newUser } = user;

//     // Return response with user data and tokens
//     return NextResponse.json({ user: newUser, accessToken, refreshToken }, { status: 200 });
//   } catch (error) {
//     console.error('Error handling login:', error);
//     if (error instanceof Error) {
//       return NextResponse.json({ message: 'Error handling login', error: error.message }, { status: 500 });
//     }
//     // Handle other unknown errors
//     return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
//   }
// }





// // import { NextRequest, NextResponse } from 'next/server';
// // import { comparePassword, generateAccessToken, findUserByEmailOrUsername } from '@/lib/userService';
// // import { generateRefreshToken } from '@/lib/userService';
// // import prisma from '@/lib/prismaClient';
// // import { cookies } from 'next/headers';

// // export async function POST(request: NextRequest) {
// //   try {
// //     const formData = await request.formData();
// //     const cookie = cookies()
// //     const identifier = formData.get('identifier') as string; // Could be email or username
// //     const password = formData.get('password') as string;
// //     console.log(identifier, password);

// //     if (!identifier || !password) {
// //       return NextResponse.json({ message: 'Identifier and password are required' }, { status: 400 });
// //     }

// //     const user = await findUserByEmailOrUsername(identifier);

// //     if (!user || !(await comparePassword(password, user.password))) {
// //       return NextResponse.json({ message: 'Invalid identifier or password' }, { status: 401 });
// //     }

// //     const accessToken = generateAccessToken(user);
// //     const refreshToken = generateRefreshToken(user);

// //     // Set the cookies with the resolved token strings
// //     !accessToken&&cookie.set("accessToken", accessToken, { httpOnly: true, secure: false });
// //     !refreshToken&&cookie.set("refreshToken", refreshToken, { httpOnly: true, secure: false });
// //     // // Set cookies for tokens (optional)
// //     // if (accessToken && refreshToken) { // Check if tokens are generated successfully
// //     //   // Option 1: Using Next.js response object's `res.cookie` (for server-side cookies)
// //     //   const res = NextResponse.json({ user, accessToken, refreshToken }, { status: 200 });

// //     //   // Set cookies conditionally for production (adjust secure, SameSite as needed)
// //     //   // if (process.env.NODE_ENV === 'production') {
// //     //     res.cookies.set('accessToken', accessToken, {
// //     //       httpOnly: true,
// //     //       secure: true,
// //     //       sameSite: 'lax', // Adjust if necessary
// //     //     });
// //     //     res.cookies.set('refreshToken', refreshToken, {
// //     //       httpOnly: true,
// //     //       secure: true,
// //     //       sameSite: 'lax', // Adjust if necessary
// //     //     });
// //     //   // }
// //     // }

// //     // // Retrieve user without sensitive fields
// //     // const loggedInUser = await prisma.user.findUnique({
// //     //   where: { id: user.id }, // Adjust if using a different identifier
// //     //   select: {
// //     //     id: true,
// //     //     email: true,
// //     //     username: true,
// //     //     fullName: true,
// //     //     // Exclude password and refreshToken by not including them
// //     //   },
// //     // });

// //     // Return response with user data and tokens
// //     const {password:_,...newUser} = user
// //     return NextResponse.json({ user:newUser, accessToken, refreshToken }, { status: 200 });
// //   } catch (error) {
// //     console.error('Error handling login:', error);
    // if (error instanceof Error) {
    //   return NextResponse.json({ message: 'Error handling login', error: error.message }, { status: 500 });
    // }
    // // Handle other unknown errors
    // return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
// //   }
// // }
// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import prisma from '@/lib/prismaClient';

// const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || '';

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const identifier = formData.get('identifier') as string; // Could be email or username
//     const password = formData.get('password') as string;

//     if (!identifier || !password) {
//       return NextResponse.json({ message: 'Identifier and password are required' }, { status: 400 });
//     }

//     const user = await prisma.user.findFirst({
//       where: {
//         OR: [{ username: identifier }, { email: identifier }],
//       },
//     });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return NextResponse.json({ message: 'Invalid identifier or password' }, { status: 401 });
//     }

//     const accessToken = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, {
//       expiresIn: '15m',
//     });
//     const refreshToken = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     // Update refresh token in the database
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { refreshToken },
//     });

//     // Set cookies
//     // const isProduction = process.env.NODE_ENV === 'production';
//     const cookies = new Map();
//     cookies.set('accessToken', accessToken);
//     cookies.set('refreshToken', refreshToken);

//     return NextResponse.json({ user, accessToken, refreshToken }, { status: 200 });
//   } catch (error) {
//     console.error('Error handling login:', error);
//     if (error instanceof Error) {
//       return NextResponse.json({ message: 'Error handling login', error: error.message }, { status: 500 });
//     }
//     // Handle other unknown errors
//     return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
//   }
// }
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prismaClient';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const identifier = formData.get('identifier') as string; // Could be email or username
    const password = formData.get('password') as string;

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Identifier and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid identifier or password' }, { status: 401 });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username,fullName:user.fullName,avatar:user.avatar,coverImage:user.coverImage,createdAt:user.createdAt,updatedAt:user.updatedAt },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username,fullName:user.fullName,avatar:user.avatar,coverImage:user.coverImage,createdAt:user.createdAt,updatedAt:user.updatedAt },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set cookies
    const response = NextResponse.json({ user, accessToken, refreshToken }, { status: 200 });
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    response.headers.set('Authorization', `Bearer ${accessToken}`);

    return response;
  } catch (error) {
    console.error('Error handling login:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error handling login', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
  }
}

