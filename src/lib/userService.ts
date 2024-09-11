import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from './prismaClient'; // Adjust the path as needed

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    password: string;
    refreshToken?: string | null; // Adjusted to match Prisma schema
    avatar: string;
    coverImage?: string | null; // Adjusted to match Prisma schema
    createdAt: Date;
    updatedAt: Date;
  }
  
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (user: User): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h', // Default to 1 hour if not specified
    }
  );

  return accessToken;
};

export const generateRefreshToken = (user: User): string => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d', // Default to 7 days if not specified
    }
  );

  return refreshToken;
};

export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const findUserByEmailOrUsername = async (identifier: string): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
      ],
    },
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export async function validateRefreshToken(refreshToken: string): Promise<User | null> {
  try {
    const decodedToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '');
    const userId = decodedToken.id;

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        password: true,
        avatar: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;
    return user;
  } catch (error) {
    console.error('Error validating refresh token:', error);
    return null;
  }
}

async function updateRefreshToken(userId: string, newRefreshToken: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: newRefreshToken },
  });
}
