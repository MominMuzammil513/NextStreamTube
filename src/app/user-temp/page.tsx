import getUserChannelProfile from '@/utils/databaseFunction/getUserChannelProfile';
import Image from 'next/image';
import React from 'react';
import SubscriptionButton from './components-temp/SubscriptionButton';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import SubscribersList from './components-temp/SubscribersList';
import { getSubscribers } from '@/utils/databaseFunction/getSubscribers';
import SubscribersChannelList from './components-temp/SubscribedChannelList';
import { getSubscriberChannelList } from '@/utils/databaseFunction/getSubscribedChannelList';
import { verifyAccessToken } from '@/lib/session';

interface Video {
  id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  duration: number;
}

interface ShortVideo {
  id: string;
  shortVideoFile: string;
  thumbnail: string;
  title: string;
  duration: number;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  videos: { video: Video }[];
}

interface ChannelProfile {
    channelId:string;
    userId:string | undefined;
  fullName: string;
  username: string;
  subscribersCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
  avatar: string;
  coverImage: string | null;
  email: string;
  playlists: Playlist[];
  shortVideos: ShortVideo[];
}

const GetChannel = async ({ params: { username } }: { params: { username: string } }) => {
  const profileOrError = await getUserChannelProfile(username);
  const accessToken = cookies().get("accessToken");
  if ('error' in profileOrError) {
      return <h1>{profileOrError.error}</h1>;
    }
    
    const {
        channelId,
        userId,
        fullName,
        username: userName,
        subscribersCount,
        channelsSubscribedToCount,
        isSubscribed,
        avatar,
        coverImage,
        email,
        playlists,
        shortVideos
    }: ChannelProfile = profileOrError;
    console.log(profileOrError,"===============");
    const subscribers = await getSubscribers(channelId)
    if (!Array.isArray(subscribers)) {
        return <h1>Failed to load subscribers.</h1>;
      }
      if (!userId) {
          return <h1>Failed to load subscribers id.</h1>;
        }
      const channel = await getSubscriberChannelList(userId)
      if (!channel) {
        return <h1>Failed to load subscribers channel.</h1>;
      }
  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        {coverImage && (
          <div className="relative mb-4">
            <Image src={coverImage} alt="Cover Image" width={1200} height={480} className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Image src={avatar} alt="Avatar" width={96} height={96} className="w-24 h-24 rounded-full border-4 border-white" />
          <div>
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-gray-400">@{userName}</p>
            <p className="text-gray-300">{email}</p>
            <p className="text-gray-300">Subscribers: {subscribersCount}</p>
            <p className="text-gray-300">Subscribed to: {channelsSubscribedToCount}</p>
            <SubscriptionButton channelId={channelId} userId={userId} isInitiallySubscribed={isSubscribed} accessToken={accessToken?.value}/>
          </div>
        </div>
        <div className='my-6'>
            <SubscribersList subscribers={subscribers}/>
        </div>
        <div className='my-6'>
            <SubscribersChannelList channels={channel.subscriptions} />
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Playlists</h2>
          {playlists.length === 0 ? (
            <p>No playlists found.</p>
          ) : (
            playlists.map(playlist => (
              <div key={playlist.id} className="mb-4">
                <h3 className="text-lg font-semibold">{playlist.name}</h3>
                <p className="text-gray-300">{playlist.description}</p>
                <div className="flex flex-wrap mt-2">
                  {playlist.videos.map(({ video }) => (
                    <div key={video.id} className="w-1/3 p-2">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <Image src={video.thumbnail} alt={video.title} width={300} height={120} className="w-full h-32 object-cover rounded-lg" />
                        <h4 className="mt-2 text-sm font-semibold">{video.title}</h4>
                        <p className="text-gray-400">{video.duration} seconds</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Short Videos</h2>
          {shortVideos.length === 0 ? (
            <p>No short videos found.</p>
          ) : (
            <div className="flex flex-wrap">
              {shortVideos.map(shortVideo => (
                <div key={shortVideo.id} className="w-1/3 p-2">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    <Image src={shortVideo.thumbnail} alt={shortVideo.title} width={300} height={120} className="w-full h-32 object-cover rounded-lg" />
                    <h4 className="mt-2 text-sm font-semibold">{shortVideo.title}</h4>
                    <p className="text-gray-400">{shortVideo.duration} seconds</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetChannel;
