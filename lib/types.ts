// lib/types.ts

// ─── Enums ────────────────────────────────────────────────────────────────────
export enum Role {
  USER   = "USER",
  AUTHOR = "AUTHOR",
  ADMIN  = "ADMIN",
}

export enum PostStatus {
  DRAFT     = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

// ─── Core Domain Types ────────────────────────────────────────────────────────
export interface User {
  id:          string;
  name:        string;
  username:    string;
  email:       string;
  avatar?:     string | null;
  bio?:        string | null;
  role:        Role;
  createdAt:   string; // ISO 8601
  updatedAt:   string;
}

export interface Category {
  id:        string;
  name:      string;
  slug:      string;
  createdAt: string;
}

export interface Post {
  id:             string;
  title:          string;
  slug:           string;
  excerpt:        string;
  content:        string;      // sanitized HTML from TipTap
  featuredImage?: string | null;
  status:         PostStatus;
  authorId:       string;
  author?:        Pick<User, "id" | "name" | "username" | "avatar">;
  categoryId?:    string | null;
  category?:      Pick<Category, "id" | "name" | "slug"> | null;
  publishedAt?:   string | null;
  createdAt:      string;
  updatedAt:      string;
}

export interface Comment {
  id:        string;
  body:      string;
  postId:    string;
  authorId:  string;
  author?:   Pick<User, "id" | "name" | "username" | "avatar">;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data:       T[];
  totalCount: number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface ApiError {
  error:  string;
  status: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id:       string;
  name:     string;
  username: string;
  email:    string;
  role:     Role;
  avatar?:  string | null;
}

export interface JwtPayload {
  userId: string;
  role:   Role;
  iat?:   number;
  exp?:   number;
}

// ─── Form / Request Shapes ─────────────────────────────────────────────────────
export interface SignupInput {
  name:     string;
  username: string;
  email:    string;
  password: string;
}

export interface LoginInput {
  email:    string;
  password: string;
}

export interface CreatePostInput {
  title:          string;
  excerpt:        string;
  content:        string;
  categoryId?:    string | null;
  featuredImage?: string | null;
  status:         PostStatus;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {}

export interface CreateCommentInput {
  body:   string;
  postId: string;
}

export interface CreateCategoryInput {
  name: string;
}