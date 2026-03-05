import { Suspense } from 'react';
import EditPostClient from './EditPostClient';
import Skeleton from '@/components/dashboard/Skeleton';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return post;
  } catch {
    return null;
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch {
    return [];
  }
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPost(id), getCategories()]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Edit Post
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Update your blog post
        </p>
      </div>

      {/* Form */}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <EditPostClient post={post} categories={categories} />
      </Suspense>
    </div>
  );
}