'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import Editor from '@/components/dashboard/Editor';
import ImageUpload from '@/components/dashboard/ImageUpload';
import { toast } from '@/components/dashboard/Toast';
import type { Category } from '@/lib/types';

interface NewPostClientProps {
  categories: Category[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewPostClient({ categories }: NewPostClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    published: false,
  });

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast('error', 'Title is required');
      return;
    }

    if (!formData.slug.trim()) {
      toast('error', 'Slug is required');
      return;
    }

    if (!formData.content.trim()) {
      toast('error', 'Content is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      toast('success', 'Post created successfully');
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
      toast('error', error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/dashboard/posts"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="Enter post title"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="post-url-slug"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
              placeholder="Brief description of the post"
            />
          </div>

          {/* Content Editor */}
          <Editor
            content={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <h3 className="font-medium text-zinc-900 dark:text-white">Publish</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, published: e.target.checked }))
                }
                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Publish immediately
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <h3 className="font-medium text-zinc-900 dark:text-white">Category</h3>
            
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <ImageUpload
            value={formData.featuredImage}
            onChange={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
          />
        </div>
      </div>
    </form>
  );
}