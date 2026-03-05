// Mock data for development without database

export interface MockPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId: string | null;
  category?: MockCategory;
  author?: MockUser;
  _count?: {
    comments: number;
  };
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    posts: number;
  };
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR';
}

// Mock Users
export const mockUsers: MockUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', image: null, role: 'ADMIN' },
  { id: '2', name: 'John Editor', email: 'john@example.com', image: null, role: 'EDITOR' },
];

// Mock Categories
export let mockCategories: MockCategory[] = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Tech related posts', createdAt: new Date(), updatedAt: new Date(), _count: { posts: 2 } },
  { id: '2', name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle articles', createdAt: new Date(), updatedAt: new Date(), _count: { posts: 1 } },
  { id: '3', name: 'Business', slug: 'business', description: 'Business insights', createdAt: new Date(), updatedAt: new Date(), _count: { posts: 0 } },
];

// Mock Posts
export let mockPosts: MockPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    slug: 'getting-started-nextjs-15',
    content: '<p>Next.js 15 is the latest version of the popular React framework...</p>',
    excerpt: 'Learn how to get started with Next.js 15',
    featuredImage: null,
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    authorId: '1',
    categoryId: '1',
    category: mockCategories[0],
    author: mockUsers[0],
    _count: { comments: 5 }
  },
  {
    id: '2',
    title: 'The Future of AI in Web Development',
    slug: 'future-ai-web-development',
    content: '<p>Artificial Intelligence is revolutionizing how we build websites...</p>',
    excerpt: 'Exploring AI in web development',
    featuredImage: null,
    published: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    authorId: '1',
    categoryId: '1',
    category: mockCategories[0],
    author: mockUsers[0],
    _count: { comments: 3 }
  },
  {
    id: '3',
    title: 'Healthy Habits for Developers',
    slug: 'healthy-habits-developers',
    content: '<p>As developers, we spend long hours sitting at our desks...</p>',
    excerpt: 'Tips for staying healthy as a developer',
    featuredImage: null,
    published: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    authorId: '2',
    categoryId: '2',
    category: mockCategories[1],
    author: mockUsers[1],
    _count: { comments: 8 }
  },
  {
    id: '4',
    title: 'Draft: Upcoming Feature',
    slug: 'upcoming-feature',
    content: '<p>This is a draft post...</p>',
    excerpt: 'A draft post',
    featuredImage: null,
    published: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    authorId: '1',
    categoryId: '1',
    category: mockCategories[0],
    author: mockUsers[0],
    _count: { comments: 0 }
  },
  {
    id: '5',
    title: 'Building Scalable APIs',
    slug: 'building-scalable-apis',
    content: '<p>Learn how to build APIs that can scale...</p>',
    excerpt: 'API best practices',
    featuredImage: null,
    published: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    authorId: '1',
    categoryId: '1',
    category: mockCategories[0],
    author: mockUsers[0],
    _count: { comments: 2 }
  },
];

// Helper functions
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Stats
export function getMockStats() {
  return {
    totalPosts: mockPosts.length,
    totalCategories: mockCategories.length,
    totalComments: mockPosts.reduce((acc, post) => acc + (post._count?.comments || 0), 0),
  };
}