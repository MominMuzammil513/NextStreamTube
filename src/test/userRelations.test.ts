import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('User Relations Tests', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "User", "Video", "ShortVideo", "Comment", "Like", "Playlist", "PlaylistVideo", "Subscription" CASCADE;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Create and fetch a user with all relationships', async () => {
    // Create a user
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        fullName: 'Test User',
        password: 'hashed_password',
        avatar: 'avatar_url',
        coverImage: 'cover_image_url',
      },
    });

    // Create another user for subscription tests
    const channel = await prisma.user.create({
      data: {
        username: 'channeluser',
        email: 'channeluser@example.com',
        fullName: 'Channel User',
        password: 'hashed_password',
        avatar: 'avatar_url',
        coverImage: 'cover_image_url',
      },
    });

    // Create a video
    const video = await prisma.video.create({
      data: {
        title: 'Test Video',
        description: 'This is a test video.',
        duration: 120,
        videoFile: 'video_file_url',
        thumbnail: 'thumbnail_url',
        owner: {
          connect: { id: user.id },
        },
      },
    });

    // Create a short video
    const shortVideo = await prisma.shortVideo.create({
      data: {
        title: 'Short Video',
        shortVideoFile: 'short_video_file_url',
        thumbnail: 'short_thumbnail_url',
        duration: 30,
        owner: {
          connect: { id: user.id },
        },
      },
    });

    // Create a comment
    const comment = await prisma.comment.create({
      data: {
        content: 'Great video!',
        video: {
          connect: { id: video.id },
        },
        owner: {
          connect: { id: user.id },
        },
      },
    });

    // Create a playlist and add video to it
    const playlist = await prisma.playlist.create({
      data: {
        name: 'Test Playlist',
        description: 'This is a test playlist.',
        owner: {
          connect: { id: user.id },
        },
        videos: {
          create: [
            {
              video: {
                connect: { id: video.id },
              },
            },
          ],
        },
      },
    });

    // Create a subscription
    const subscription = await prisma.subscription.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        channel: {
          connect: { id: channel.id },
        },
      },
    });

    // Fetch user with all related data
    const fetchedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        videos: true,
        shortVideos: true,
        comments: true,
        likes: true,
        tweets: true,
        playlists: {
          include: {
            videos: true,
          },
        },
        subscriptions: true,
        subscribers: true,
      },
    });

    // Fetch video with comments and likes
    const fetchedVideo = await prisma.video.findUnique({
      where: { id: video.id },
      include: {
        comments: true,
        likes: true,
      },
    });

    // Fetch short video with comments and likes
    const fetchedShortVideo = await prisma.shortVideo.findUnique({
      where: { id: shortVideo.id },
      include: {
        comments: true,
        likes: true,
      },
    });

    // Fetch playlist with videos
    const fetchedPlaylist = await prisma.playlist.findUnique({
      where: { id: playlist.id },
      include: {
        videos: {
          include: {
            video: true,
          },
        },
      },
    });

    // Fetch subscription
    const fetchedSubscription = await prisma.subscription.findUnique({
      where: { id: subscription.id },
      include: {
        user: true,
        channel: true,
      },
    });

    // Assertions
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser?.videos).toHaveLength(1);
    expect(fetchedUser?.shortVideos).toHaveLength(1);
    expect(fetchedUser?.comments).toHaveLength(1);
    expect(fetchedUser?.playlists).toHaveLength(1);
    expect(fetchedUser?.subscriptions).toHaveLength(1);
    expect(fetchedUser?.subscribers).toHaveLength(0);

    expect(fetchedVideo).toBeDefined();
    expect(fetchedVideo?.comments).toHaveLength(1);

    expect(fetchedShortVideo).toBeDefined();
    expect(fetchedShortVideo?.comments).toHaveLength(0);

    expect(fetchedPlaylist).toBeDefined();
    expect(fetchedPlaylist?.videos).toHaveLength(1);
    expect(fetchedPlaylist?.videos[0].video).toBeDefined();

    expect(fetchedSubscription).toBeDefined();
    expect(fetchedSubscription?.user).toBeDefined();
    expect(fetchedSubscription?.channel).toBeDefined();
  });
});
