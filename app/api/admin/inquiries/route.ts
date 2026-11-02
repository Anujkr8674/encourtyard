import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '15', 10)));
    const search = (url.searchParams.get('search') || '').trim();
    const status = (url.searchParams.get('status') || 'ALL').toUpperCase();
    const spaceInterest = url.searchParams.get('spaceInterest') || 'ALL';

    const offset = (page - 1) * limit;

    // Build base query
    let query = supabaseAdmin
      .from('contact_inquiries')
      .select('*', { count: 'exact' });

    // Status filter
    if (status !== 'ALL') {
      query = query.eq('status', status);
    }

    // Space of interest filter
    if (spaceInterest !== 'ALL') {
      query = query.eq('spaceInterest', spaceInterest);
    }

    // Search filter across multiple fields
    if (search) {
      query = query.or(
        `fullName.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%,message.ilike.%${search}%`
      );
    }

    // Order and paginate (15 rows per page)
    const { data: inquiries, count, error } = await query
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching contact inquiries:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to fetch inquiries' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch aggregate statistics for the KPI badges
    const [
      { count: pendingCount },
      { count: contactedCount },
      { count: resolvedCount },
      { count: totalAllCount },
    ] = await Promise.all([
      supabaseAdmin.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabaseAdmin.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'CONTACTED'),
      supabaseAdmin.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'RESOLVED'),
      supabaseAdmin.from('contact_inquiries').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      success: true,
      inquiries: inquiries || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
      stats: {
        total: totalAllCount || 0,
        pending: pendingCount || 0,
        contacted: contactedCount || 0,
        resolved: resolvedCount || 0,
      },
    });
  } catch (error: any) {
    console.error('API /api/admin/inquiries error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (status !== undefined) {
      const validStatuses = ['PENDING', 'CONTACTED', 'RESOLVED', 'ARCHIVED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes ? String(adminNotes).trim() : null;
    }

    const { data, error } = await supabaseAdmin
      .from('contact_inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inquiry:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry: data,
    });
  } catch (error: any) {
    console.error('API /api/admin/inquiries PATCH error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('contact_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inquiry:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to delete inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error: any) {
    console.error('API /api/admin/inquiries DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
