// import * as jwt from "jsonwebtoken";

// export default async function isValidJWT(token: string) {
//                      // You should have a super secret store in .env.local
//   const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";
//   // Transform the callback into a promise
//   return new Promise((resolve) => {
//     // you can return the payload instead of true if you want.
//     jwt.verify(token, JWT_SECRET, function (err, payload) {
//       if (err) resolve(false);
//       return resolve(true);
//     });
//   });
// }

import jwt from 'jsonwebtoken';
import prisma from '@/lib/prismaClient';

// Define the JWT secret key (ideally, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface User {
  id: string;
  username: string;
  email: string;
  // Add other fields as needed
}

export async function validateRefreshToken(refreshToken: string): Promise<User | null> {
  try {
    // Verify and decode the token
    const decodedToken: any = jwt.verify(refreshToken, JWT_SECRET);

    // Extract user ID or other necessary information
    const userId = decodedToken.id;

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Optionally, select specific fields
      select: {
        id: true,
        username: true,
        email: true,
        // Add other fields as needed
      },
    });

    // Check if user exists
    if (!user) {
      return null;
    }

    // Return user data if the token is valid and user exists
    return user;
  } catch (error) {
    console.error('Error validating refresh token:', error);
    return null;
  }
}
