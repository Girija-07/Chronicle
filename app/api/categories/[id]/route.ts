import { NextRequest, NextResponse } from 'next/server';
import { mockCategories, mockPosts } from '@/lib/mockData';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryIndex = mockCategories.findIndex((c) => c.id === id);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has posts
    const postsCount = mockPosts.filter((post) => post.categoryId === id).length;

    if (postsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    mockCategories.splice(categoryIndex, 1);

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}