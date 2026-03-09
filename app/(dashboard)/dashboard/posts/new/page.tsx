import { Suspense } from 'react';
import NewPostClient from './NewPostClient';
import Skeleton from '@/components/dashboard/Skeleton';
import prisma from '@/lib/prisma';

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

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Create New Post
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Write a new blog post
        </p>
      </div>

      {/* Form */}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <NewPostClient categories={categories} />
      </Suspense>
    </div>
  );
}

