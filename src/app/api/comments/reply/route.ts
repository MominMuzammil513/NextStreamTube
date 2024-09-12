import prisma from "@/lib/prismaClient";
import { getUserFromToken } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // Authenticate user
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    // Parse request body
    const { content, commentId } = await req.json();
    
    if (!content || !commentId) {
      return NextResponse.json({ error: 'Content and commentId are required' }, { status: 400 });
    }
  
    try {
      // Find the parent comment
      const parentComment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
  
      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
  
      // Create the reply
      const reply = await prisma.comment.create({
        data: {
          content,
          ownerId: user.id,
          parentId: commentId,  // Link to the parent comment
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
  
      return NextResponse.json(reply, { status: 201 });
    } catch (error) {
      console.error('Error adding reply:', error);
      return NextResponse.json({ error: 'Error adding reply' }, { status: 500 });
    }
  }