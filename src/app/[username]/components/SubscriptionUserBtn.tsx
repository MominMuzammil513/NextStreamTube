"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Subscriber {
    id: string;
    createdAt: Date;
    userId: string;
    channelId: string;
}

const SubscriptionUserBtn = ({
    subscribers,
    userId,
    channelId,
}: {
    subscribers: Subscriber[];
    userId: string;
    channelId: string;
}) => {
    const [isSubscribed, setIsSubscribed] = useState(subscribers.some(subscriber => subscriber.userId === userId));

    const toggleSubscription = async () => {
        try {
            const response = await fetch('/api/auth/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, channelId }),
            });
            const result = await response.json();
            console.log(response,"RRRRRRRRRRRR");
            setIsSubscribed(!isSubscribed);
            toast.success(result.message);
        } catch (error) {
            toast.error('Failed to update subscription');
        }
    };

    return (
        <div className="px-6 py-4">
            {userId !== channelId && (
                <button
                    onClick={toggleSubscription}
                    className={`px-4 py-2 rounded ${isSubscribed ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                >
                    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
            )}
        </div>
    );
};

export default SubscriptionUserBtn;
