import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile'];

  // Get the URL path
  const url = new URL(request.url);

  // Check if the request path is a protected route
  if (protectedRoutes.includes(url.pathname)) {
    // Get and verify the access token
    const tokenPayload = await getAccessToken(request);

    // If no valid token, redirect to login page
    if (!tokenPayload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Allow access if token is valid
    return NextResponse.next();
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // Adjust as needed
};



// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import prisma from '@/lib/prismaClient'; // Adjust the import path as needed
// interface CustomJwtPayload extends jwt.JwtPayload {
//   id: string;
// }

// console.log("Middleware=============================");
// export async function middleware(req: NextRequest) {
//   // try {
//     const token =
//       req.cookies.get('accessToken')?.value ||
//       req.headers.get('Authorization')?.replace('Bearer ', '');
// console.log(token);
//     if (!token) {
//       return NextResponse.json({ message: 'Invalid Access Token---------' })
//     }
//     // Verify JWT token
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as CustomJwtPayload;
// console.log(decodedToken,"DDDDDDDDD");
//     // Find the user in the database using Prisma
//     const user = await prisma.user.findUnique({
//       where: { id: decodedToken.id },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ message: 'Invalid Access Token============' }, { status: 401 });
//     }

//     // Set user data in a custom header
//     const response = NextResponse.next();
//     response.headers.set('x-user-id', user.id);
//     response.headers.set('x-user-username', user.username);
//     response.headers.set('x-user-email', user.email);

//     return response;
//   // } catch (error) {
//   //   return NextResponse.json({ message: 'Invalid access token' }, { status: 401 });
//   // }
// }

// export const config = {
//   matcher: ['/api/:path*','/:path'],
// };
