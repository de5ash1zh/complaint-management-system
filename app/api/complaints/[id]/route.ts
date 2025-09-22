import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Complaint from '@/models/Complaint';
import { sendStatusUpdateEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/complaints/[id] - Get single complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const complaint = await Complaint.findById(params.id);

    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}

// PATCH /api/complaints/[id] - Update complaint
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    await dbConnect();

    const body = await request.json();
    const updates = body;

    // Get the current complaint to check for status changes
    const currentComplaint = await Complaint.findById(params.id);
    
    if (!currentComplaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Update the complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      params.id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedComplaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Send email notification if status changed
    if (updates.status && updates.status !== currentComplaint.status) {
      try {
        await sendStatusUpdateEmail(updatedComplaint);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedComplaint,
      message: 'Complaint updated successfully'
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
    
    // Handle validation errors
    if ((error as any).name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}

// DELETE /api/complaints/[id] - Delete complaint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    await dbConnect();

    const deletedComplaint = await Complaint.findByIdAndDelete(params.id);

    if (!deletedComplaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete complaint' },
      { status: 500 }
    );
  }
}
