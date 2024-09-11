// pages/api/subscribe.ts

import prisma from '@/lib/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest ) {
        const { userId, channelId } =await req.json()
        console.log(userId, channelId),"CCCCCCCCCCCCCCCCCCCCC";

        try {
            const existingSubscription = await prisma.subscription.findFirst({
                where: { userId, channelId },
            });

            if (existingSubscription) {
                await prisma.subscription.delete({
                    where: { id: existingSubscription.id },
                });
                return NextResponse.json({ message: 'Successfully unsubscribed' },{status:200});
            } else {
                await prisma.subscription.create({
                    data: { userId, channelId },
                });
                return NextResponse.json({ message: 'Successfully subscribed' },{status:200});
            }
        } catch (error) {
            return NextResponse.json({ message: 'Internal server error' },{status:500});
        }
}




// import prisma from "@/lib/prismaClient";
// import { verifyAccessToken } from "@/lib/session";
// import { NextRequest, NextResponse } from "next/server";

// const getTokenFromHeader = (header: string | null) => {
//   if (header && header.startsWith("Bearer ")) {
//     return header.split(" ")[1];
//   }
//   return null;
// };

// export const POST = async (req: NextRequest) => {
//   const { userId, channelId } = await req.json();
  
//   if (!userId || !channelId) {
//     return NextResponse.json({ error: 'User ID and Channel ID are required' }, { status: 400 });
//   }

//   try {
//     const authHeader = req.headers.get('Authorization');
//     console.log("Authorization Header:", authHeader);  // Log the header
    
//     const accessToken = getTokenFromHeader(authHeader);
//     if (!accessToken) {
//       return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
//     }

//     const currentUser = await verifyAccessToken(accessToken);
//     if (!currentUser) {
//       return NextResponse.json({ message: "Access token not valid or expired" }, { status: 401 });
//     }

//     const subscription = await prisma.subscription.create({
//       data: { userId, channelId }
//     });

//     return NextResponse.json(subscription);
//   } catch (error) {
//     console.error("Error in POST request:", error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// };

// export const DELETE = async (req: NextRequest) => {
//   try {
//     const { userId, channelId } = await req.json();

//     if (!userId || !channelId) {
//       return NextResponse.json({ error: 'User ID and Channel ID are required' }, { status: 400 });
//     }

//     const authHeader = req.headers.get('Authorization');
//     console.log("Authorization Header:", authHeader);  // Log the header
    
//     const accessToken = getTokenFromHeader(authHeader);
//     if (!accessToken) {
//       return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
//     }

//     const currentUser = await verifyAccessToken(accessToken);
//     if (!currentUser) {
//       return NextResponse.json({ message: "Access token not valid or expired" }, { status: 401 });
//     }
//     // Remove subscription
//     const subscription = await prisma.subscription.deleteMany({
//       where: { userId, channelId }
//     });

//     return NextResponse.json(subscription);
//   } catch (error) {
//     console.error("Error in DELETE request:", error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// };

// export async function GET(request: NextRequest) {
//   // try {
//   //   const channelId = request.

//   //   if (!channelId) {
//   //     return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
//   //   }

//   //   const subscribers = await prisma.subscription.findMany({
//   //     where: { channelId },
//   //     include: { user: true }, // This includes user details in the response
//   //   });

//   //   return NextResponse.json(subscribers);
//   // } catch (error) {
//   //   console.error('Error fetching subscribers:', error);
//   //   return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   // }
// }

