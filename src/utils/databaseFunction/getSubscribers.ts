"use server";

import prisma from "@/lib/prismaClient";

export const getSubscribers = async (channelId: string) => {
  try {
    if (!channelId) {
      return [];
    }
    const subscribers = await prisma.subscription.findMany({
      where: { channelId },
      include: { user: true }, // This includes user details in the response
    });

    return subscribers.map(subscriber => ({
      ...subscriber,
      user: {
        ...subscriber.user,
        coverImage: subscriber.user.coverImage || null, // Ensure coverImage is handled correctly
      },
    }));
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return { error: 'Internal Server Error' };
  }
};
