"use server"
import prisma from "@/lib/prismaClient";
import { getAccessToken } from "@/lib/session";
import { NextRequest } from "next/server";

export const getSubscriberChannelList = async(userId:string|undefined)=> {
  try {
    if (!userId) return { error:"no access token available or invalid access token",message: "Unauthorized user or token expired"}


    // Find all channels (users) to which the user has subscribed
    const subscriptions = await prisma.subscription.findMany({
      where: { id:userId },
      include: {
        channel: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    return {subscriptions: subscriptions.map((sub) => sub.channel)}
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return { message: "Internal server error",error: "Internal server error" }
  }
}
