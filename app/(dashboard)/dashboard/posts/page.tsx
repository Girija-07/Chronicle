import { Suspense } from 'react';
import PostsClient from './PostsClient';
import { SkeletonTable } from '@/components/dashboard/Skeleton';

async function getPosts(page: number = 1, limit: number = 10) {
  try {
    const response = await fetch(`/api/posts?page=${page}&limit=${limit}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return response.json();
  } catch {
    return {
      data: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 0,
    };
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const postsData = await getPosts(page);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Posts
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your blog posts
        </p>
      </div>

      {/* Posts Table */}
      <Suspense fallback={<SkeletonTable />}>
        <PostsClient
          initialData={postsData}
          currentPage={page}
        />
      </Suspense>
    </div>
  );
}

