import VideoCard from './VideoCard';

interface Video {
  id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  isFeatured: boolean;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  channel: string;          // Add channel
  uploadedAt: string;       // Add uploadedAt
}

export default function VideoGrid({ allVideos }: { allVideos: Video[] }) {
  // Map the incoming videos to add `channel` and `uploadedAt`
  const modifiedVideos = allVideos.map((video) => ({
    ...video,
    channel: "Default Channel", // Replace with actual channel name, if available
    uploadedAt: video.publishedAt ? video.publishedAt : video.createdAt, // Assuming uploadedAt based on publishedAt or createdAt
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 xl:w-[calc(100%-30vh)] lg:w-[calc(100%-10vh)] md:w-[calc(100%-10vh)] sm:w-[calc(100%-10vh)] w-full absolute right-0">
      {modifiedVideos.length > 0 ? (
        modifiedVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500">No videos available</div>
      )}
    </div>
  );
}
