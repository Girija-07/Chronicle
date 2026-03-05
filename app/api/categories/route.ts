import { NextRequest, NextResponse } from 'next/server';
import { mockCategories, mockPosts, generateId, slugify } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let filteredCategories = [...mockCategories];

    // Apply search filter
    if (search) {
      filteredCategories = filteredCategories.filter(
        (category) =>
          category.name.toLowerCase().includes(search.toLowerCase()) ||
          (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Sort by name
    filteredCategories.sort((a, b) => a.name.localeCompare(b.name));

    // Pagination
    const total = filteredCategories.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + limit);

    // Update post counts
    const categoriesWithCounts = paginatedCategories.map((category) => ({
      ...category,
      _count: {
        posts: mockPosts.filter((post) => post.categoryId === category.id).length,
      },
    }));

    return NextResponse.json({
      data: categoriesWithCounts,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || slugify(name);

    // Check if slug already exists
    const existingCategory = mockCategories.find((category) => category.slug === finalSlug);
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    const newCategory = {
      id: generateId(),
      name,
      slug: finalSlug,
      description: description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { posts: 0 },
    };

    mockCategories.push(newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}