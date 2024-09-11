import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SuggestedVideo {
  id: string;
  title: string;
  thumbnail: string;
}

interface SuggestedVideosSectionProps {
  videos: SuggestedVideo[];
}
const dummySuggestedVideos: SuggestedVideo[] = [
    {
      id: '1',
      title: 'Exploring the Cosmos',
      thumbnail: 'https://via.placeholder.com/150x90?text=Video+1',
    },
    {
      id: '2',
      title: 'The Wonders of Nature',
      thumbnail: 'https://via.placeholder.com/150x90?text=Video+2',
    },
    {
      id: '3',
      title: 'Tech Innovations 2024',
      thumbnail: 'https://via.placeholder.com/150x90?text=Video+3',
    },
    {
      id: '4',
      title: 'Cooking Masterclass',
      thumbnail: 'https://via.placeholder.com/150x90?text=Video+4',
    },
  ];
const SuggestedVideosSection: React.FC<SuggestedVideosSectionProps> = ({ videos }) => {
  return (
    <div className="mt-8 pl-10 pr-8">
      <h3 className="text-xl font-bold text-white">You May Also Like</h3>
      <div className="mt-4 flex flex-col">
        {dummySuggestedVideos.map(video => (
          <div key={video.id} className="relative group">
            <Link href={`/video/${video.id}`}>
              <div className="block">
                <div className="relative w-full h-36 md:h-48">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <p className="text-white mt-2 text-sm md:text-base truncate">{video.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedVideosSection;
