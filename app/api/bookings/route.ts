import { NextRequest, NextResponse } from 'next/server';

// This would be replaced with actual database logic

import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import Customer from '@/lib/models/Customer';
import Vendor from '@/lib/models/Vendor';
import { generateBookingId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { shopId, shopName, serviceId, service, customerName, customerPhone, customerEmail, date, time } =
      await request.json();

    if (!shopId || !serviceId || !customerName || !customerPhone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findById(shopId);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    let customer = await Customer.findOne({ phoneNumber: customerPhone });
    if (!customer) {
      customer = new Customer({
        name: customerName,
        phoneNumber: customerPhone,
        email: customerEmail || '',
      });
      await customer.save();
    }

    const existingBookings = await Booking.countDocuments({
      shopId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      },
      status: { $in: ['confirmed', 'waiting', 'serving'] },
    });

    const queuePosition = existingBookings + 1;

    const booking = new Booking({
      bookingId: generateBookingId(),
      shopId,
      shopName,
      serviceId,
      service,
      customerId: customer._id,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      date: new Date(date),
      time,
      status: 'confirmed',
      queuePosition,
      estimatedTime: queuePosition * 20,
    });

    await booking.save();

    customer.bookings.push(booking._id);
    await customer.save();

    vendor.currentQueue.push(booking._id);
    await vendor.save();

    return NextResponse.json(
      {
        success: true,
        booking: {
          bookingId: booking.bookingId,
          shopName: booking.shopName,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          status: booking.status,
          queuePosition: booking.queuePosition,
          estimatedTime: booking.estimatedTime,
          createdAt: booking.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    const query: any = {};
    if (shopId) query.shopId = shopId;
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('customerId', 'name phoneNumber email')
      .populate('serviceId', 'name estimatedTime price');

    const total = await Booking.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: bookings,
        pagination: { total, limit, skip, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
