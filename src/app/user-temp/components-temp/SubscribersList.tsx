"use client";

import Image from "next/image";

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string | null; // Cover image can be null
  }
  
  export interface Subscriber {
    id: string;
    createdAt: Date;
    userId: string;
    channelId: string;
    user: User;
  }
  

const SubscribersList = ({ subscribers }: {subscribers:Subscriber[]}) => {
  return (
    <div>
      <h1>Subscribers</h1>
      {subscribers.length === 0 ? (
        <p>No subscribers found.</p>
      ) : (
        <ul>
          {subscribers.map((subscriber) => (
            <li key={subscriber.id} className="flex items-center space-x-4 p-2 border-b border-gray-200">
              <div className="flex-shrink-0">
                <Image src={subscriber.user.avatar} alt={subscriber.user.username} width={50} height={50} className="rounded-full" />
              </div>
              <div>
                <p><strong>{subscriber.user.username}</strong></p>
                <p>{subscriber.user.fullName}</p>
                <p>{subscriber.user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscribersList;
