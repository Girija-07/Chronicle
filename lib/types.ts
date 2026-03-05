export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId?: string;
  category?: Category;
  author?: User;
  _count?: {
    comments: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    posts: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR';
}

export interface Comment {
  id: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  postId: string;
  userId: string;
  user?: User;
  post?: Post;
}

export interface DashboardStats {
  totalPosts: number;
  totalCategories: number;
  totalComments: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}