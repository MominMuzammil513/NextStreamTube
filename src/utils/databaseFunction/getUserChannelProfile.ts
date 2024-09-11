"use server";
import prisma from '@/lib/prismaClient';
import { verifyAccessToken } from '@/lib/session';
import { cookies } from 'next/headers';
const getUserChannelProfile = async (username: string) => {
  const accessToken = cookies().get('accessToken')?.value;
  const currentUser = accessToken ? await verifyAccessToken(accessToken) : null;

  try {
    // Fetch user profile details
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        subscribers: true,
        subscriptions: {
          include: { channel: true }
        },
        playlists: {
          include: {
            videos: {
              include: {
                video: true
              }
            }
          }
        },
        shortVideos: true
      }
    });

    // Check if the user exists
    if (!user) {
      return { error: 'User not found' }; // Return an error object if user not found
    }

    // Calculate profile details
    const subscribersCount = user.subscribers.length;
    const channelsSubscribedToCount = user.subscriptions.length;

    // Determine if the current user is subscribed to the profile user
    const isSubscribed = currentUser 
      ? user.subscribers.some(subscriber => subscriber.userId === currentUser.id)
      : false;

    // Construct response object
    const response = {
      channelId: user.id, 
      userId: currentUser?.id,
      fullName: user.fullName,
      username: user.username,
      subscribersCount,
      channelsSubscribedToCount,
      isSubscribed,
      avatar: user.avatar,
      coverImage: user.coverImage,
      email: user.email,
      playlists: user.playlists,
      shortVideos: user.shortVideos
    };

    return response;
  } catch (error) {
    console.error(error);
    return { error: 'Internal Server Error' };
  }
};

export default getUserChannelProfile;
