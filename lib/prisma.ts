// Mock Prisma client for development without database
// This provides a similar interface to PrismaClient but uses in-memory data

import { mockPosts, mockCategories, generateId, slugify, MockPost, MockCategory } from './mockData';

// Type definitions for mock queries
interface MockWhere {
  id?: string;
  slug?: string;
  categoryId?: string;
  published?: boolean;
  OR?: Array<{
    title?: { contains: string; mode: string };
    content?: { contains: string; mode: string };
  }>;
}

interface MockInclude {
  category?: boolean;
  author?: boolean;
  _count?: { select: { comments: boolean } };
}

interface MockOrderBy {
  createdAt?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
}

// Mock query builder
const createMockQuery = () => ({
  findMany: async (options?: {
    where?: MockWhere;
    include?: MockInclude;
    orderBy?: MockOrderBy;
    skip?: number;
    take?: number;
  }) => {
    let results = [...mockPosts];

    if (options?.where) {
      const { where } = options;
      
      if (where.id) {
        results = results.filter(p => p.id === where.id);
      }
      
      if (where.slug) {
        results = results.filter(p => p.slug === where.slug);
      }
      
      if (where.categoryId) {
        results = results.filter(p => p.categoryId === where.categoryId);
      }
      
      if (where.published !== undefined) {
        results = results.filter(p => p.published === where.published);
      }

      if (where.OR) {
        const searchTerm = where.OR[0]?.title?.contains || where.OR[0]?.content?.contains || '';
        results = results.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    // Order by
    if (options?.orderBy?.createdAt) {
      results.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return options.orderBy?.createdAt === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    // Pagination
    const skip = options?.skip || 0;
    const take = options?.take || results.length;
    results = results.slice(skip, skip + take);

    // Include relations
    if (options?.include) {
      return results.map(post => {
        const result: Record<string, unknown> = { ...post };
        if (!options.include?.category) delete result.category;
        if (!options.include?.author) delete result.author;
        if (!options.include?._count) delete result._count;
        return result;
      });
    }

    return results;
  },

  findUnique: async (options: { where: { id?: string; slug?: string } }) => {
    const { where } = options;
    let result = mockPosts.find(p => p.id === where.id || p.slug === where.slug);
    return result || null;
  },

  create: async (options: { data: Partial<MockPost> }) => {
    const newPost: MockPost = {
      id: generateId(),
      title: options.data.title || 'Untitled',
      slug: options.data.slug || slugify(options.data.title || 'untitled'),
      content: options.data.content || '',
      excerpt: options.data.excerpt || '',
      featuredImage: options.data.featuredImage || null,
      published: options.data.published || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: options.data.authorId || '1',
      categoryId: options.data.categoryId || null,
      _count: { comments: 0 },
    };
    mockPosts.unshift(newPost);
    return newPost;
  },

  update: async (options: { where: { id: string }; data: Partial<MockPost> }) => {
    const index = mockPosts.findIndex(p => p.id === options.where.id);
    if (index === -1) throw new Error('Post not found');
    
    mockPosts[index] = {
      ...mockPosts[index],
      ...options.data,
      updatedAt: new Date(),
    };
    return mockPosts[index];
  },

  delete: async (options: { where: { id: string } }) => {
    const index = mockPosts.findIndex(p => p.id === options.where.id);
    if (index === -1) throw new Error('Post not found');
    mockPosts.splice(index, 1);
    return { id: options.where.id };
  },

  count: async (options?: { where?: MockWhere }) => {
    let results = [...mockPosts];
    if (options?.where?.categoryId) {
      results = results.filter(p => p.categoryId === options.where?.categoryId);
    }
    if (options?.where?.published !== undefined) {
      results = results.filter(p => p.published === options.where?.published);
    }
    return results.length;
  },
});

// Categories mock query
const createMockCategoryQuery = () => ({
  findMany: async (options?: {
    where?: { name?: { contains: string; mode: string }; description?: { contains: string; mode: string } };
    include?: { _count?: { select: { posts: boolean } } };
    orderBy?: { name: 'asc' | 'desc' };
    skip?: number;
    take?: number;
  }) => {
    let results = [...mockCategories];

    if (options?.orderBy?.name) {
      results.sort((a, b) => 
        options.orderBy?.name === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    }

    const skip = options?.skip || 0;
    const take = options?.take || results.length;
    results = results.slice(skip, skip + take);

    // Add post counts
    return results.map(cat => ({
      ...cat,
      _count: {
        posts: mockPosts.filter(p => p.categoryId === cat.id).length,
      },
    }));
  },

  findUnique: async (options: { where: { id?: string; slug?: string } }) => {
    const { where } = options;
    let result = mockCategories.find(c => c.id === where.id || c.slug === where.slug);
    if (result) {
      return {
        ...result,
        _count: { posts: mockPosts.filter(p => p.categoryId === result.id).length },
      };
    }
    return null;
  },

  create: async (options: { data: Partial<MockCategory> }) => {
    const newCategory: MockCategory = {
      id: generateId(),
      name: options.data.name || 'Unnamed',
      slug: options.data.slug || slugify(options.data.name || 'unnamed'),
      description: options.data.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { posts: 0 },
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  delete: async (options: { where: { id: string } }) => {
    const index = mockCategories.findIndex(c => c.id === options.where.id);
    if (index === -1) throw new Error('Category not found');
    mockCategories.splice(index, 1);
    return { id: options.where.id };
  },

  count: async () => mockCategories.length,
});

// Export mock Prisma client
export const prisma = {
  post: createMockQuery(),
  category: createMockCategoryQuery(),
  comment: {
    count: async () => mockPosts.reduce((acc, p) => acc + (p._count?.comments || 0), 0),
  },
  $connect: async () => {},
  $disconnect: async () => {},
} as unknown as {
  post: ReturnType<typeof createMockQuery>;
  category: ReturnType<typeof createMockCategoryQuery>;
  comment: { count: () => Promise<number> };
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
};

// Default export for compatibility
export default prisma;