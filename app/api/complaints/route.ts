import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Complaint from '@/models/Complaint';
import { sendNewComplaintEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/complaints - Fetch all complaints
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;

    // Get complaints with pagination
    const complaints = await Complaint.find(filter)
      .sort({ dateSubmitted: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Complaint.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

// POST /api/complaints - Create new complaint
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();

    const body = await request.json();
    const { title, description, category, priority, email, customerName } = body;

    // Validate required fields
    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new complaint
    const complaint = new Complaint({
      title,
      description,
      category,
      priority,
      email,
      customerName,
      userId: (session.user as any).id,
      status: 'Pending',
      dateSubmitted: new Date()
    });

    const savedComplaint = await complaint.save();

    // Send email notification to admin
    try {
      await sendNewComplaintEmail(savedComplaint);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      data: savedComplaint,
      message: 'Complaint submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating complaint:', error);
    
    // Handle validation errors
    if ((error as any).name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}
