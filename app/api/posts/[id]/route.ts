import { NextRequest, NextResponse } from 'next/server';
import { mockPosts, mockCategories, slugify } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, excerpt, featuredImage, published, categoryId } = body;

    const postIndex = mockPosts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const existingPost = mockPosts[postIndex];

    // Check if slug is being changed and if it's already taken
    if (slug && slug !== existingPost.slug) {
      const slugExists = mockPosts.find((p) => p.slug === slug && p.id !== id);
      if (slugExists) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const updatedPost = {
      ...existingPost,
      title: title || existingPost.title,
      slug: slug || existingPost.slug,
      content: content || existingPost.content,
      excerpt: excerpt || existingPost.excerpt,
      featuredImage: featuredImage !== undefined ? featuredImage : existingPost.featuredImage,
      published: published !== undefined ? published : existingPost.published,
      categoryId: categoryId !== undefined ? categoryId : existingPost.categoryId,
      category: categoryId ? mockCategories.find((c) => c.id === categoryId) : existingPost.category,
      updatedAt: new Date(),
    };

    mockPosts[postIndex] = updatedPost;

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postIndex = mockPosts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    mockPosts.splice(postIndex, 1);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
