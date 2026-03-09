'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostTable from '@/components/dashboard/PostTable';
import type { Post } from '@/lib/types';
import type { PaginatedResponse } from '@/lib/types';

interface PostsClientProps {
  initialData: PaginatedResponse<Post>;
  currentPage: number;
}

export default function PostsClient({ initialData, currentPage }: PostsClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${newPage}&limit=10`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.data);
      setTotal(data.total);
      setPage(newPage);
      router.push(`/dashboard/posts?page=${newPage}`, { scroll: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }

    // Update the local state
    setPosts(posts.filter((post) => post.id !== id));
    setTotal(total - 1);
  };

  return (
    <PostTable
      posts={posts}
      total={total}
      page={page}
      limit={10}
      onPageChange={handlePageChange}
      onDelete={handleDelete}
    />
  );
}

