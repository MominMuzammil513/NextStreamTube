import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prismaClient';
import CustomVideoPlayer from './components/CustomVideoPlayer';
import CommentsSection from './components/CommentsSection';
import LikesSection from './components/LikesSection';
import SuggestedVideosSection from './components/SuggestedVideosSection';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/session';
import Image from 'next/image';
import { Bookmark, BookMarked, Download, Flag, Save, Scissors, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { ShareSvg } from '../../../public/svgs/Svg';
import Link from 'next/link';
import DescriptionSection from './components/DescriptionSection';

export const metadata: Metadata = {
  title: 'Watch Video',
  description: 'Watch video details and interact with comments and likes.',
};

interface Video {
  id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string
  owner: {
    username: string;
    avatar: string;
    subscribers?: Subscriber[];
  };
  comments: Comment[];
  likes: Like[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  owner: {
    username: string;
    avatar: string;
  };
}

interface Like {
  id: string;
  likedBy: {
    user: {
      username: string;
    };
  }[];
}

interface Subscriber {
  id: string;
  createdAt: string;
  channel: {
    username: string;
    avatar: string;
  };
  channelId: string;
}

const getVideo = async (id: string): Promise<Video | null> => {
  try {
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            owner: true,
          },
        },
        likes: {
          include: {
            likedBy: {
              include: {
                user: true,
              },
            },
          },
        },
        owner: {
          include: {
            subscribers: {
              include: {
                channel: true, // Include the channel field
              },
            },
          },
        },
      },
    });

    if (video) {
      return {
        id: video.id,
        title: video.title,
        description: video.description,
        videoFile: video.videoFile,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views,
        createdAt: video.createdAt.toLocaleString(),
        owner: {
          username: video.owner.username,
          avatar: video.owner.avatar,
          subscribers: video.owner.subscribers.map(subscriber => ({
            id: subscriber.id,
            createdAt: subscriber.createdAt.toISOString(),
            channel: {
              username: subscriber.channel.username,
              avatar: subscriber.channel.avatar,
            },
            channelId: subscriber.channelId,
          })),
        },
        comments: video.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
          owner: {
            username: comment.owner.username,
            avatar: comment.owner.avatar,
          },
        })),
        likes: video.likes.map(like => ({
          id: like.id,
          likedBy: like.likedBy.map(likeBy => ({
            user: {
              username: likeBy.user.username,
            },
          })),
        })),
      };
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};


const getSuggestedVideos = async (currentVideo: Video): Promise<Video[]> => {
  try {
    const suggestedVideos = await prisma.video.findMany({
      where: {
        AND: [
          { id: { not: currentVideo.id } },
          { views: { gte: currentVideo.views - 1000 } },
        ],
      },
      take: 5,
      orderBy: {
        views: 'desc',
      },
      include: {
        owner: true,
        comments: {
          include: {
            owner: true,
          },
        },
        likes: {
          include: {
            likedBy: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return suggestedVideos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      videoFile: video.videoFile,
      thumbnail: video.thumbnail,
      duration: video.duration,
      views: video.views,
      createdAt: video.createdAt.toLocaleString(),
      owner: {
        username: video.owner.username,
        avatar: video.owner.avatar,
      },
      comments: video.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        owner: {
          username: comment.owner.username,
          avatar: comment.owner.avatar,
        },
      })),
      likes: video.likes.map(like => ({
        id: like.id,
        likedBy: like.likedBy.map(likeBy => ({
          user: {
            username: likeBy.user.username,
          },
        })),
      })),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

interface WatchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const WatchPage: React.FC<WatchPageProps> = async ({ searchParams }) => {
  const videoId = searchParams.id as string;

  if (!videoId) {
    return <div className='mt-20'>Loading or Invalid Video ID...</div>;
  }

  const video = await getVideo(videoId);

  if (!video) {
    return <div className='mt-20'>Video not found</div>;
  }

  const suggestedVideos = await getSuggestedVideos(video);
  // console.log(suggestedVideos,"+++++++++++");
  const accessToken = cookies().get('accessToken');
  if (!accessToken) {
    return <div className='mt-20'>No user accessToken available</div>;
  }

  const user = await getCurrentUser(accessToken.value);

  if (!user) {
    return <div className='mt-20'>No user data available</div>;
  }

  const currentUser = {
    id: user.id,
    name: user.fullName,
    avatar: user.avatar
  };

  return (
    <div className="container mx-auto px-14 py-8 ">
      <div className="flex">
        {/* Video Player */}
        <div className="flex-1">
          <CustomVideoPlayer
            videoFile={video.videoFile}
            thumbnail={video.thumbnail}
            title={video.title}
            views={video.views}
          />
          {/* Video Title */}
          <h1 className='font-bold text-2xl dark:text-white text-black pt-3'>{video.title}</h1>
          {/* Profile */}
          <div className='flex justify-between items-center mt-2 py-1'>
            <div className='flex justify-center items-center'>
              <Image src={video.owner.avatar} alt={"User channel profile"} width={1000} height={1000} className='h-10 w-10 object-contain bg-gray-700 rounded-full' />
              <div className='ml-4'>
                <h2 className='font-semibold dark:text-white text-black'>{video.owner.username}</h2>
                <h3 className='text-sm dark:text-[#9c9b9b] font-medium'><span className='mr-1'>{video.owner.subscribers && video.owner.subscribers.length}</span>subscribers </h3>
              </div>
              <button className='dark:bg-white text-black rounded-full text-center ml-5 py-1.5 px-3.5 font-semibold tracking-tight hover:opacity-80'>Subscribe</button>
            </div>
            <div className='flex justify-center items-center gap-x-3'>
              <div className='bg-transparent rounded-full flex justify-between items-center dark:bg-[#2b2b2b]'>
                <button className='hover:dark:bg-[#424040] hover:bg-opacity-55 rounded-l-full pl-4 pr-2 py-2 flex justify-between items-center gap-x-2'>
                  <ThumbsUpIcon className='py-0.5' />
                  <span>0</span>
                </button>

                {/* Vertical line as a border */}
                <div className='h-6 border-l border-[#7a7676]' />

                <button className='hover:dark:bg-[#424040] hover:bg-opacity-55 px-4 py-2 rounded-r-full flex justify-between items-center'>
                  <ThumbsDownIcon className='py-0.5' />
                </button>
              </div>
              <button className='hover:dark:bg-[#424040] dark:bg-[#2b2b2b] hover:bg-opacity-55 px-4 py-2 rounded-full flex justify-between items-center dark:fill-white fill-black font-medium text-sm gap-x-1'>
                <ShareSvg />Share
              </button>
              <button className='hover:dark:bg-[#424040] dark:bg-[#2b2b2b] hover:bg-opacity-55 px-4 py-2 rounded-full flex justify-between items-center dark:fill-white fill-black font-medium text-sm gap-x-1'>
                <Download className='py-0.5' />Download
              </button>
              <div className="relative inline-block text-left">
                <button
                  className='hover:dark:bg-[#424040] dark:bg-[#2b2b2b] hover:bg-opacity-55 rounded-full flex justify-center items-center dark:fill-white fill-black  font-bold tracking-wide h-10 w-10 p-0 focus:outline-none group'
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M6 12a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                  </svg>

                  {/* Dropdown menu */}
                  <div className="absolute top-full left-1.5 w-max rounded-lg shadow-lg bg-white dark:bg-[#2b2b2b] ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-focus-within:block z-50">
                    <div className="py-1.5" role="none">
                      {/* Dropdown Item 1 */}
                      <Link
                        href="#"
                        className="dark:text-white flex justify-start gap-x-3 items-center font-medium hover:dark:bg-[#424040] hover:bg-opacity-55 pl-4 pr-6 py-2 text-sm"
                        role="menuitem"
                      >
                        <Scissors className='h-5 w-5' />Clips
                      </Link>
                      {/* Dropdown Item 2 */}
                      <Link
                        href="#"
                        className="dark:text-white flex justify-start gap-x-3 items-center font-medium hover:dark:bg-[#424040] hover:bg-opacity-55 pl-4 pr-6 py-2 text-sm"
                        role="menuitem"
                      >
                        <Bookmark className='h-5 w-5' />Save
                      </Link>
                      {/* Dropdown Item 3 */}
                      <Link
                        href="#"
                        className="dark:text-white flex justify-start gap-x-3 items-center font-medium hover:dark:bg-[#424040] hover:bg-opacity-55 pl-4 pr-6 py-2 text-sm"
                        role="menuitem"
                      >
                        <Flag className='h-5 w-5' />Report
                      </Link>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* description Section */}
          {/* <div className='mt-6 px-3 py-2.5 dark:bg-[#2b2b2b] bg-white rounded-lg flex flex-col'>
            <div className='flex justify-start items-center gap-x-2'>
              <h1 className='font-medium flex justify-center items-center'>{video.views} views</h1>
              <h1 className='font-medium flex justify-center items-center'>6 hours</h1>
            </div>
            <p className='h-16 mt-4'>{video.description}</p>
          </div> */}
          <DescriptionSection description={video.description} uploadTime={video.createdAt} views={video.views}/>
          {/* Comments Section */}
          <CommentsSection videoId={videoId} currentUser={currentUser} />
        </div>
        {/* Suggested Videos */}
        <div className="w-1/3 ml-4">
          <SuggestedVideosSection videos={suggestedVideos} />
        </div>
      </div>
    </div>
  );
};

export default WatchPage;