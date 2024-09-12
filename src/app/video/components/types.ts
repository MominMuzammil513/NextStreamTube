// types.ts
export type Reply = {
    id: string;
    content: string;
    createdAt: string;
    ownerId: string;
    owner: {
      id: string;
      username: string;
      avatar: string;
    };
    userLikeStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    likesCount: number;
    likes: Like[];
  };
  
  export type Comment = {
    id: string;
    content: string;
    createdAt: string;
    ownerId: string;
    owner: {
      id: string;
      username: string;
      avatar: string;
    };
    replies?: Reply[];
    userLikeStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    likesCount: number;
    dislikesCount: number;
  };
  interface Like {
    id: string;
    userId: string;
  }