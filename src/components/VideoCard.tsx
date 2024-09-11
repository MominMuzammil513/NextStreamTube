import Image from "next/image";
import Link from "next/link";

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  channel: string;
  views: number;
  uploadedAt: string;
}

const VideoCard = ({ video }: { video: Video }) => {
  return (
    <Link href={`/video?id=${video.id}`} passHref>
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 duration-300 ease-in-out">
        {/* Video Thumbnail */}
        <div className="relative pb-56">
          <Image
            src={video.thumbnail}
            alt={video.title}
            height={1000}
            width={1000}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white truncate">
            {video.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {video.channel}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>{formatViews(video.views)} views</span>
            <span>{timeAgo(video.uploadedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * Utility function to format large numbers for views count
 */
function formatViews(views: number) {
  if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1) + "M";
  } else if (views >= 1_000) {
    return (views / 1_000).toFixed(1) + "K";
  }
  return views.toString();
}

/**
 * Utility function to calculate how long ago the video was uploaded
 */
function timeAgo(date: string) {
  const uploadedDate = new Date(date);
  const now = new Date();
  const differenceInSeconds = Math.floor((now.getTime() - uploadedDate.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(differenceInSeconds / secondsInUnit);
    if (interval > 1) {
      return `${interval} ${unit}s ago`;
    } else if (interval === 1) {
      return `1 ${unit} ago`;
    }
  }

  return "Just now";
}

export default VideoCard;
