import Link from 'next/link';
import Image from 'next/image';
import { FileText, Folder, MessageSquare, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import type { Post } from '@/lib/types';

async function getStats(): Promise<{
  totalPosts: number;
  totalCategories: number;
  totalComments: number;
  recentPosts: Post[];
}> {
  try {
    const [totalPosts, totalCategories, totalComments, recentPosts] = await Promise.all([
      prisma.post.count(),
      prisma.category.count(),
      prisma.comment.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

    return {
      totalPosts,
      totalCategories,
      totalComments,
      recentPosts,
    };
  } catch {
    return {
      totalPosts: 0,
      totalCategories: 0,
      totalComments: 0,
      recentPosts: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      label: 'Categories',
      value: stats.totalCategories,
      icon: Folder,
      color: 'bg-green-500',
    },
    {
      label: 'Comments',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Welcome back! Here&apos;s an overview of your blog.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Recent Posts
          </h2>
          <Link
            href="/dashboard/posts"
            className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {stats.recentPosts.length > 0 ? (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {stats.recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/dashboard/posts/${post.id}/edit`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                {post.featuredImage && (
                  <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-white truncate">
                    {post.title}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {post.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {post.category.name}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">
              No posts yet. Create your first post to get started.
            </p>
            <Link
              href="/dashboard/posts/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

