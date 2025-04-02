export interface User {
    id: string;
    username: string;
    profilePicture?: string;
    bio?: string;
  }
  
  export interface AuthTokens {
    access_token: string;
    refresh_token: string;
  }
  
  export interface Community {
    id: string;
    category: string;
    homePhoto?: string;
    description?: string;
    followersCount: number;
    creatorId: string;
    isFollowed?: boolean;
    creator?: {
      username: string;
    };
  }
  
  export interface Post {
    id: string;
    content: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    authorId: string;
    author: {
      username: string;
      profilePicture?: string;
    };
    communityId: string;
    community: {
      category: string;
    };
  }
  
  export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author: {
      username: string;
      profilePicture?: string;
    };
    postId: string;
  }
  
  export interface AuthData {
    username: string;
    password: string;
  }
  
  export interface CreatePostData {
    content: string;
    photo?: string;
    communityId: string;
  }
  
  export interface CreateCommunityData {
    category: string;
    homePhoto?: string;
    description?: string;
  }