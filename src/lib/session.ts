"use server";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "./prismaClient";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(ACCESS_TOKEN_SECRET)
    );
    return payload as { id: string; email: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function getAccessToken(req: NextRequest) {
  // Check the Authorization header
  const authHeader = req.headers.get("Authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("Access token from Authorization header:", token);
  }

  // If no token from Authorization header, check the cookies
  if (!token) {
    const cookie = req.cookies.get("accessToken");
    token = cookie?.value || null;
    console.log("Access token from cookies:", token);
  }

  if (!token) {
    console.log("No access token found in cookies or Authorization header.");
    return null;
  }

  const verifiedToken = await verifyAccessToken(token);
  console.log("Verified Token:", verifiedToken);

  return verifiedToken;
}

export const getCurrentUser = async (token: string) => {
  const verifiedToken = await verifyAccessToken(token);
  if (!verifiedToken?.id) {
    console.log("Token not found or expired.");
    return null;
  }

  return prisma.user.findUnique({
    where: { id: verifiedToken.id },
    include: {
      videos: true,
      shortVideos: true,
      comments: true,
      likes: {
        include: {
          like: true, // Include details of the liked content
        },
      },
      tweets: true,
      playlists: {
        include: {
          videos: true, // Include videos in each playlist
        },
      },
    },
  });
};
export async function getUserFromToken(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken"); // Extract token from cookies
  if (!accessToken) {
    return null;
  }

  // Verify the token and get the payload
  const tokenPayload = await verifyAccessToken(accessToken.value);
  if (!tokenPayload) {
    return null;
  }

  // Fetch the user from the database
  return await prisma.user.findUnique({
    where: { id: tokenPayload.id },
    select: { id: true, email: true, username: true } // Select fields as needed
  });
}