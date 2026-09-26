import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, imageUrl, capacity, badge, features, order, isActive } = body;

    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name.trim();
    if (description !== undefined) updatePayload.description = description.trim();
    if (imageUrl !== undefined) updatePayload.imageUrl = imageUrl.trim();
    if (capacity !== undefined) updatePayload.capacity = capacity?.trim() || null;
    if (order !== undefined) updatePayload.order = typeof order === 'number' ? order : Number(order) || 1;
    if (isActive !== undefined) updatePayload.isActive = isActive;

    let featuresArray: string[] = [];
    if (features !== undefined) {
      if (Array.isArray(features)) {
        featuresArray = features.map((f: any) => String(f || '').trim()).filter(Boolean).slice(0, 4);
        updatePayload.badge = JSON.stringify(featuresArray);
        updatePayload.features = JSON.stringify(featuresArray);
      } else if (typeof features === 'string') {
        try {
          const parsed = JSON.parse(features);
          if (Array.isArray(parsed)) {
            featuresArray = parsed.map((f: any) => String(f || '').trim()).filter(Boolean).slice(0, 4);
            updatePayload.badge = JSON.stringify(featuresArray);
            updatePayload.features = JSON.stringify(featuresArray);
          } else {
            featuresArray = [features.trim()];
            updatePayload.badge = JSON.stringify(featuresArray);
            updatePayload.features = JSON.stringify(featuresArray);
          }
        } catch {
          featuresArray = [features.trim()];
          updatePayload.badge = JSON.stringify(featuresArray);
          updatePayload.features = JSON.stringify(featuresArray);
        }
      }
    } else if (badge !== undefined) {
      if (badge) {
        try {
          const parsed = JSON.parse(badge);
          if (Array.isArray(parsed)) featuresArray = parsed.slice(0, 4);
          else featuresArray = [badge.trim()];
        } catch {
          featuresArray = [badge.trim()];
        }
        updatePayload.badge = JSON.stringify(featuresArray);
        updatePayload.features = JSON.stringify(featuresArray);
      } else {
        updatePayload.badge = null;
        updatePayload.features = '[]';
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updatePayload,
    });

    return NextResponse.json({
      success: true,
      category: {
        ...updatedCategory,
        features: featuresArray,
      },
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
