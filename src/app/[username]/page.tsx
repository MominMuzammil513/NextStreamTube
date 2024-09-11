import prisma from '@/lib/prismaClient';
import Image from 'next/image';
import React from 'react';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/session';
import SubscriptionUserBtn from './components/SubscriptionUserBtn';

const getChannel = async (username: string) => {
    const channel = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            avatar: true,
            coverImage: true,
            refreshToken: true,
            createdAt: true,
            updatedAt: true,
            videos: true,
            shortVideos: true,
            comments: true,
            likes: {
                include: {
                    like: true,
                },
            },
            tweets: true,
            playlists: {
                include: {
                    videos: {
                        include: {
                            video: true,
                        },
                    },
                },
            },
            subscriptions: {
                include: {
                    channel: true,
                },
            },
            subscribers: {
                include: {
                    user: true,
                },
            },
        },
    });

    return channel;
};

const handelSubscriptionsButton = async (userId: string, channelId: string) => {
    try {
        const existingSubscription = await prisma.subscription.findFirst({
            where: { userId, channelId },
        });

        if (existingSubscription) {
            await prisma.subscription.delete({
                where: { id: existingSubscription.id },
            });
            return { message: 'Successfully unsubscribed' };
        } else {
            await prisma.subscription.create({
                data: {
                    userId,
                    channelId,
                },
            });
            return { message: 'Successfully subscribed' };
        }
    } catch (error) {
        return { message: 'Internal server error' };
    }
};

const YourChannelPage = async ({ params: { username } }: { params: { username: string } }) => {
    const accessToken = cookies().get('accessToken');
    if (!accessToken) {
        return <div>No user accessToken available</div>;
    }
    const user = await verifyAccessToken(accessToken.value);
    if (!user) {
        return <div>No user data available</div>;
    }
    const channel = await getChannel(username);
    if (!channel) return <h1>Channel not available</h1>;
    console.log(channel, '0000000000000000');
    return (
        <div className="min-h-screen px-6">
            {/* Channel Profile */}
            <div className="max-w-7xl mx-auto shadow-md rounded-xl overflow-hidden border-2 border-white">
                <div className="relative h-60 border-b-2">
                    <Image
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                        src={channel.coverImage || '/default-cover.jpg'}
                        alt="Cover Image"
                    />
                    <div className="absolute -bottom-16 left-10">
                        <Image
                            width={1000}
                            height={1000}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                            src={channel.avatar || '/default-avatar.jpg'}
                            alt="Avatar"
                        />
                    </div>
                </div>
                <div className="px-6 mt-16">
                    <h2 className="text-3xl font-semibold">{channel.fullName}</h2>
                    <p className="text-gray-600">@{channel.username}</p>
                    <p className="text-gray-500 mt-2">{channel.email}</p>
                </div>
                <div className="px-6 py-4">
                    <p className="text-gray-700">
                        Member since:{' '}
                        {new Date(channel.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <div className="px-6 py-4">
                    <SubscriptionUserBtn
                        channelId={channel.id}
                        subscribers={channel.subscribers}
                        userId={user.id}
                    />
                </div>
            </div>

            {/* Videos Section */}
            <div className="max-w-7xl mx-auto mt-8">
                <h3 className="text-2xl font-semibold mb-4">Videos</h3>
                {channel.videos.length === 0 ? (
                    <p className="text-gray-600">No videos uploaded yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {channel.videos.map((video) => (
                            <div key={video.id} className="shadow-md rounded-lg overflow-hidden">
                                <Image
                                    width={1000}
                                    height={1000}
                                    className="w-full h-48 object-cover"
                                    src={video.thumbnail || '/default-thumbnail.jpg'}
                                    alt={video.title}
                                />
                                <div className="p-4">
                                    <h4 className="font-semibold">{video.title}</h4>
                                    <p className="text-gray-600">{video.description}</p>
                                    <p className="text-gray-500 text-sm">
                                        Views: {video.views} | Duration: {video.duration} sec
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Subscriptions Section */}
            <div className="max-w-7xl mx-auto mt-8">
                <h3 className="text-2xl font-semibold mb-4">Subscriptions</h3>
                {channel.subscriptions.length === 0 ? (
                    <p className="text-gray-600">No subscriptions yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {channel.subscriptions.map((subscription) => (
                            <div key={subscription.id} className="shadow-md rounded-lg p-4 flex items-center">
                                <Image
                                    width={1000}
                                    height={1000}
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                    src={subscription.channel.avatar || '/default-avatar.jpg'}
                                    alt={subscription.channel.username}
                                />
                                <div>
                                    <h4 className="font-semibold">{subscription.channel.fullName}</h4>
                                    <p className="text-gray-600">@{subscription.channel.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Subscribers Section */}
            <div className="max-w-7xl mx-auto mt-8">
                <h3 className="text-2xl font-semibold mb-4">Subscribers</h3>
                {channel.subscribers.length === 0 ? (
                    <p className="text-gray-600">No subscribers yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {channel.subscribers.map((subscriber) => (
                            <div key={subscriber.id} className="shadow-md rounded-lg p-4 flex items-center">
                                <Image
                                    width={1000}
                                    height={1000}
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                    src={subscriber.user.avatar || '/default-avatar.jpg'}
                                    alt={subscriber.user.username}
                                />
                                <div>
                                    <h4 className="font-semibold">{subscriber.user.fullName}</h4>
                                    <p className="text-gray-600">@{subscriber.user.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tweets Section */}
            <div className="max-w-7xl mx-auto mt-8">
                <h3 className="text-2xl font-semibold mb-4">Tweets</h3>
                {channel.tweets.length === 0 ? (
                    <p className="text-gray-600">No tweets yet.</p>
                ) : (
                    <div className="space-y-4">
                        {channel.tweets.map((tweet) => (
                            <div key={tweet.id} className="shadow-md rounded-lg p-4 bg-white">
                                <h4 className="font-semibold">{tweet.content}</h4>
                                <p className="text-gray-600 text-sm">
                                    Posted on: {new Date(tweet.createdAt).toLocaleDateString('en-US')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default YourChannelPage;
