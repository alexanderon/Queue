import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import Vendor from '@/lib/models/Vendor';

export async function GET(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    await connectDB();
    const { vendorId } = params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const bookings = await Booking.find({
      shopId: vendorId,
      status: { $in: ['confirmed', 'waiting', 'serving'] },
    }).sort({ queuePosition: 1 });

    const currentlyServing = bookings.find((b) => b.status === 'serving');

    const queue = bookings.map((b) => ({
      id: b._id.toString(),
      bookingId: b.bookingId,
      name: b.customerName,
      service: b.service,
      position: b.queuePosition,
      arrivalTime: b.time,
      status: b.status,
      estimatedTime: b.estimatedTime,
    }));

    return NextResponse.json({
      vendorId,
      queue,
      totalInQueue: queue.length,
      currentlyServing: currentlyServing
        ? {
            id: currentlyServing._id.toString(),
            name: currentlyServing.customerName,
            bookingId: currentlyServing.bookingId,
          }
        : null,
    });
  } catch (error) {
    console.error('Fetch queue error:', error);
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    await connectDB();
    const { vendorId } = params;
    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'bookingId and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['confirmed', 'waiting', 'serving', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const booking = await Booking.findOneAndUpdate(
      { bookingId, shopId: vendorId },
      { status },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookings = await Booking.find({
      shopId: vendorId,
      status: { $in: ['confirmed', 'waiting', 'serving'] },
    }).sort({ queuePosition: 1 });

    const queue = bookings.map((b) => ({
      id: b._id.toString(),
      bookingId: b.bookingId,
      name: b.customerName,
      service: b.service,
      position: b.queuePosition,
      arrivalTime: b.time,
      status: b.status,
      estimatedTime: b.estimatedTime,
    }));

    return NextResponse.json({
      success: true,
      queue,
      message: 'Queue updated successfully',
    });
  } catch (error) {
    console.error('Update queue error:', error);
    return NextResponse.json({ error: 'Failed to update queue' }, { status: 500 });
  }
}
