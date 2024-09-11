"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SubscriptionButtonProps {
  userId: string | undefined;
  channelId: string;
  isInitiallySubscribed: boolean;
  accessToken:string | undefined // Initial state passed from the server or parent component
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ userId, channelId, isInitiallySubscribed,accessToken }) => {
  const [isSubscribed, setIsSubscribed] = useState(isInitiallySubscribed);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  // Handle subscription logic
  const subscribe = async () => {
    if(!userId || !accessToken) return router.push('/login')
    setLoading(true);
    try {
      const response = await fetch('/api/auth/subscribe', {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, channelId }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubscribed(true);
        toast.success('Subscribed successfully!');
      } else {
        toast.error(data.error || 'Failed to subscribe.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Something went wrong.');
    }
    setLoading(false);
  };

  // Handle unsubscription logic
  const unsubscribe = async () => {
    if(!userId || !accessToken) return router.push('/login')
    setLoading(true);
    try {
      const response = await fetch('/api/auth/subscribe', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ userId, channelId }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubscribed(false);
        toast.success('Unsubscribed successfully!');
      } else {
        toast.error(data.error || 'Failed to unsubscribe.');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={loading}
      className={`px-4 py-2 font-semibold text-white rounded-md ${
        isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {loading ? 'Processing...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  );
};

export default SubscriptionButton;
