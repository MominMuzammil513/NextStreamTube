export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    password: string;
    refreshToken?: string | null; // Nullable field
    avatar: string;
    coverImage?: string | null; // Nullable field
    createdAt: Date;
    updatedAt: Date;
  
    // Relations
    videos: Video[];          // Videos uploaded by the user
    shortVideos: ShortVideo[]; // Short videos uploaded by the user
    comments: Comment[];      // Comments made by the user
    likes: LikeUser[];        // Likes made by the user
    tweets: Tweet[];          // Tweets made by the user
    playlists: Playlist[];    // Playlists created by the user
  }
  
  // Additional interfaces for related models based on your schema
  
  export interface Video {
    id: string;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: User;           // User who uploaded the video
    comments: Comment[];   // Comments associated with the video
    likes: Like[];         // Likes associated with the video
    playlists: PlaylistVideo[]; // Playlists containing the video
  }
  
  export interface ShortVideo {
    id: string;
    shortVideoFile: string;
    thumbnail: string;
    title: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: User;          // User who uploaded the short video
    comments: Comment[]; // Comments associated with the short video
    likes: Like[];       // Likes associated with the short video
  }
  
  export interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    video?: Video;         // Associated video (nullable)
    shortVideo?: ShortVideo; // Associated short video (nullable)
    owner: User;          // User who made the comment
    likes: Like[];        // Likes associated with the comment
  }
  
  export interface Like {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    video?: Video;         // Associated video (nullable)
    comment?: Comment;     // Associated comment (nullable)
    shortVideo?: ShortVideo; // Associated short video (nullable)
    tweet?: Tweet;         // Associated tweet (nullable)
    likedBy: LikeUser[];   // Users who liked this content
  }
  
  export interface LikeUser {
    id: string;
    like: Like;  // Associated like
    likeId: string;
    user: User;  // User who liked the content
    userId: string;
  }
  
  export interface Tweet {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    owner: User;   // User who made the tweet
    likes: Like[]; // Likes associated with the tweet
  }
  
  export interface Playlist {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    owner: User;    // User who created the playlist
    videos: PlaylistVideo[]; // Videos in the playlist
  }
  
  export interface PlaylistVideo {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    playlist: Playlist; // Associated playlist
    playlistId: string;
    video: Video;       // Associated video
    videoId: string;
  }
  