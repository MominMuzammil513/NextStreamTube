import VideoGrid from "@/components/VideoGrid";
import prisma from "@/lib/prismaClient";

export default async function Home() {
  const allVideos = await prisma.video.findMany({
    select: {
      id: true,
      videoFile: true,
      thumbnail: true,
      title: true,
      description: true,
      duration: true,
      views: true,
      isPublished: true,
      isFeatured: true,
      category: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
      owner: {
        select: {
          username: true, // Channel name
        },
      },
    },
  });

  // Transform and add missing fields
  const transformedVideos = allVideos.map((video) => ({
    ...video,
    createdAt: video.createdAt.toISOString(),
    updatedAt: video.updatedAt.toISOString(),
    publishedAt: video.publishedAt ? video.publishedAt.toISOString() : null,
    channel: video.owner.username, // Use the owner's username as the channel name
    uploadedAt: video.publishedAt ? video.publishedAt.toISOString() : video.createdAt.toISOString(), // Set uploadedAt
  }));

  return (
    <>
      <div className="pt-20">
        <VideoGrid allVideos={transformedVideos} />
      </div>
    </>
  );
}
