// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { verifyAccessToken } from '@/lib/session';// Ensure you have this utility function

async function getUserFromToken(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");
  if (!accessToken) {
    return null;
  }

  const tokenPayload = await verifyAccessToken(accessToken.value);
  if (!tokenPayload) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { id: tokenPayload.id },
    select: { id: true, email: true, username: true }
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { videoId },
      include: {
        owner: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalComments = await prisma.comment.count({ where: { videoId } });
    console.log(comments,"============================",totalComments);

    return NextResponse.json({ comments, totalComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  console.log(user,"UUUUUUUUUUUUUUUUUUU");
    const { videoId, content } = await req.json();
  
    if (!videoId || !content) {
      return NextResponse.json({ error: 'Video ID and content are required' }, { status: 400 });
    }
  
    console.log('Creating comment with data:', { content, videoId, ownerId: user.id });
  
    try {
      // Create the comment
      const comment = await prisma.comment.create({
        data: {
          content,
          videoId,
          ownerId: user.id,
        },
        include: {
          owner: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      console.log('Comment created:', comment);
      return NextResponse.json(comment,{status:201});
    } catch (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json({ error: 'Error adding comment' }, { status: 500 });
    }
  }
//   export async function POST(req: NextRequest) {
//     const { videoId, content, ownerId } =await req.json();
//     console.log({ videoId, content, ownerId },"DDDD");
//   if (!videoId || !content || !ownerId) {
//     return NextResponse.json({ message: 'Missing required fields' },{status:401});
//   }

//   try {
//     // Ensure the videoId and ownerId exist in the database
//     const videoExists = await prisma.video.findUnique({ where: { id: videoId } });
//     const userExists = await prisma.user.findUnique({ where: { id: ownerId } });

//     if (!videoExists || !userExists) {
//       return NextResponse.json({ message: 'Video or user not found' },{status:402});
//     }

//     const comment = await prisma.comment.create({
//       data: {
//         content,
//         videoId,
//         ownerId,
//       },
//     });

//     return NextResponse.json({comment},{status:201});
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     NextResponse.json({ message: 'Internal server error' },{status:500});
//   }
// }
  
export async function PATCH(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { commentId, content } = await req.json();

  if (!commentId || !content) {
    return NextResponse.json({ error: 'Comment ID and content are required' }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.updateMany({
      where: {
        id: commentId,
        ownerId: user.id,
      },
      data: { content },
    });

    if (comment.count === 0) {
      return NextResponse.json({ error: 'Comment not found or you do not have permission to edit' }, { status: 404 });
    }

    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        owner: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Error updating comment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get('commentId');

  if (!commentId) {
    return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.deleteMany({
      where: {
        id: commentId,
        ownerId: user.id,
      },
    });

    if (comment.count === 0) {
      return NextResponse.json({ error: 'Comment not found or you do not have permission to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Error deleting comment' }, { status: 500 });
  }
}