import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const booking = await Booking.findOne({ bookingId: id })
      .populate('customerId', 'name phoneNumber email')
      .populate('serviceId', 'name estimatedTime price');

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }


    return NextResponse.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch booking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
