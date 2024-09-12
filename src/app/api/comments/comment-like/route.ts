// app/api/likes/route.ts

import prisma from '@/lib/prismaClient';
import { LikeType } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, type, targetType, targetId } = await request.json();

    if (!userId || !type || !targetType || !targetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['LIKE', 'DISLIKE'].includes(type)) {
      return NextResponse.json({ error: 'Invalid like type' }, { status: 400 });
    }

    if (!['video', 'comment'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid target type' }, { status: 400 });
    }

    // Check if the like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        [targetType === 'video' ? 'videoId' : 'commentId']: targetId,
        likedBy: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (existingLike) {
      // Update existing like
      const updatedLike = await prisma.like.update({
        where: { id: existingLike.id },
        data: { type: type as LikeType }
      });

      return NextResponse.json(updatedLike);
    } else {
      // Create new like
      const newLike = await prisma.like.create({
        data: {
          type: type as LikeType,
          [targetType === 'video' ? 'videoId' : 'commentId']: targetId,
          likedBy: {
            create: {
              userId: userId
            }
          }
        }
      });

      return NextResponse.json(newLike,{status:200});
    }
  } catch (error) {
    console.error('Error in like/dislike operation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, targetType, targetId } = await request.json();

    if (!userId || !targetType || !targetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['video', 'comment'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid target type' }, { status: 400 });
    }

    const deletedLike = await prisma.like.deleteMany({
      where: {
        [targetType === 'video' ? 'videoId' : 'commentId']: targetId,
        likedBy: {
          some: {
            userId: userId
          }
        }
      }
    });

    return NextResponse.json({ message: 'Like removed successfully' },{status:200});
  } catch (error) {
    console.error('Error in removing like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}