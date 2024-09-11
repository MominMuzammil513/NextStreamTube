import React from 'react';

interface Like {
  id: string;
  likedBy: {
    user: {
      username: string;
    };
  }[];
}

interface LikesSectionProps {
  likes: Like[];
  description:string
}

const LikesSection: React.FC<LikesSectionProps> = ({ likes,description }) => {
  return (
    <div className="likes-section mt-6 px-4 py-4 bg-gray-800 rounded-lg">
      <p className='text-lg font-semibold text-white'>{description}</p>
      <h3 className="text-lg font-semibold text-white">{likes.length} Likes</h3>
    </div>
  );
};

export default LikesSection;
