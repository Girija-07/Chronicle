import { NextRequest, NextResponse } from 'next/server';
import { mockPosts, mockCategories, generateId, slugify } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const published = searchParams.get('published');

    let filteredPosts = [...mockPosts];

    // Apply filters
    if (search) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      filteredPosts = filteredPosts.filter((post) => post.categoryId === categoryId);
    }

    if (published !== null && published !== undefined) {
      filteredPosts = filteredPosts.filter((post) => post.published === (published === 'true'));
    }

    // Sort by created date
    filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedPosts,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, featuredImage, published, categoryId } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || slugify(title);

    // Check if slug already exists
    const existingPost = mockPosts.find((post) => post.slug === finalSlug);
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    const newPost = {
      id: generateId(),
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || content.substring(0, 150),
      featuredImage: featuredImage || null,
      published: published || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: '1',
      categoryId: categoryId || null,
      category: categoryId ? mockCategories.find((c) => c.id === categoryId) : undefined,
      _count: { comments: 0 },
    };

    mockPosts.unshift(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}