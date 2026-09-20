import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma, localStore, syncCategoriesToDisk, LocalCategory } from '@/lib/prisma';
import { parseCategoryFeatures } from '../route';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, imageUrl, capacity, badge, features, order, isActive } = body;

    const updatePayload: any = {
      updatedAt: new Date().toISOString(),
    };
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
      } else if (typeof features === 'string') {
        try {
          const parsed = JSON.parse(features);
          if (Array.isArray(parsed)) {
            featuresArray = parsed.map((f: any) => String(f || '').trim()).filter(Boolean).slice(0, 4);
            updatePayload.badge = JSON.stringify(featuresArray);
          } else {
            featuresArray = [features.trim()];
            updatePayload.badge = JSON.stringify(featuresArray);
          }
        } catch {
          featuresArray = [features.trim()];
          updatePayload.badge = JSON.stringify(featuresArray);
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
      } else {
        updatePayload.badge = null;
      }
    }

    let updatedCategory: any = null;

    // 1. Direct Supabase Database Update
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update(updatePayload)
        .or(`id.eq.${id},slug.eq.${id}`)
        .select();

      if (!error && Array.isArray(data) && data.length > 0) {
        updatedCategory = data[0];
      } else if (error) {
        console.warn('Supabase direct update error:', error.message);
      }
    } catch (sbErr) {
      console.warn('Supabase category update error:', sbErr);
    }

    // 2. Fallback to Prisma
    if (!updatedCategory) {
      try {
        updatedCategory = await (prisma as any).category.update({
          where: { id },
          data: {
            ...updatePayload,
            features: updatePayload.badge || '[]',
          },
        });
      } catch (dbErr) {
        console.warn('Prisma category update fallback:', dbErr);
      }
    }

    // 3. Fallback to local memory / disk
    if (!updatedCategory) {
      let existing: LocalCategory | undefined = localStore.categories?.get(id);
      if (!existing && localStore.categories) {
        for (const [key, val] of localStore.categories.entries()) {
          if (val.id === id || val.slug === id) {
            existing = val;
            break;
          }
        }
      }

      if (existing) {
        updatedCategory = {
          ...existing,
          ...updatePayload,
          id: existing.id,
          slug: existing.slug,
          features: updatePayload.badge || existing.features || '[]',
        };
        localStore.categories?.set(existing.id, updatedCategory);
        syncCategoriesToDisk();
      } else {
        updatedCategory = {
          id,
          name: name || 'Custom Category',
          slug: `${id.toLowerCase()}`,
          description: description || '',
          imageUrl: imageUrl || '',
          capacity: capacity || null,
          badge: updatePayload.badge || null,
          features: updatePayload.badge || '[]',
          order: updatePayload.order || 1,
          isActive: isActive !== false,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...updatePayload,
        };
        localStore.categories?.set(id, updatedCategory);
        syncCategoriesToDisk();
      }
    } else {
      localStore.categories?.set(updatedCategory.id, updatedCategory);
      syncCategoriesToDisk();
    }

    const finalFeatures = parseCategoryFeatures(updatedCategory);

    return NextResponse.json({
      success: true,
      category: {
        ...updatedCategory,
        features: finalFeatures,
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

    // Delete in Supabase directly
    try {
      await supabaseAdmin
        .from('categories')
        .delete()
        .or(`id.eq.${id},slug.eq.${id}`);
    } catch (sbErr) {
      console.warn('Supabase category delete fallback:', sbErr);
    }

    try {
      await (prisma as any).category.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('Prisma delete fallback:', dbErr);
    }

    localStore.categories?.delete(id);
    syncCategoriesToDisk();

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

