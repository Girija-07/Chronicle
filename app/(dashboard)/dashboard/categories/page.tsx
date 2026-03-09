import { Suspense } from 'react';
import CategoriesClient from './CategoriesClient';
import { SkeletonTable } from '@/components/dashboard/Skeleton';
import prisma from '@/lib/prisma';

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Categories
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your blog categories
        </p>
      </div>

      {/* Categories List */}
      <Suspense fallback={<SkeletonTable />}>
        <CategoriesClient initialCategories={categories} />
      </Suspense>
    </div>
  );
}

