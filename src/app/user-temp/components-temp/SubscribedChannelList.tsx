"use client"

import Image from 'next/image';

interface Channel {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  }
  
const SubscribersChannelList = ({ channels }: { channels: Channel[] | undefined }) => {
    if (!channels) return <h1>No channels available</h1>;
  
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <h1 className="text-2xl font-semibold mb-5">Subscribed Channels</h1>
        {channels.length === 0 ? (
          <p className="text-center text-gray-500">{`You haven't subscribed to any channels yet.`}</p>
        ) : (
          <ul className="space-y-4">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className="flex items-center p-4 bg-white shadow-sm rounded-lg border border-gray-200"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={channel.avatar}
                    alt={channel.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">{channel.username}</p>
                  <p className="text-sm text-gray-500">{channel.fullName}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
export default SubscribersChannelList;
