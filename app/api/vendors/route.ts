import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import { seedVendorsIfEmpty } from '@/lib/seed';

export async function GET() {
  try {
    await connectDB();
    await seedVendorsIfEmpty();

    const vendors = await Vendor.find()
      .select('_id shopName businessStartTime businessEndTime')
      .sort({ shopName: 1 });

    return NextResponse.json({
      success: true,
      data: vendors.map((vendor) => ({
        id: vendor._id.toString(),
        shopName: vendor.shopName,
        businessStartTime: vendor.businessStartTime,
        businessEndTime: vendor.businessEndTime,
      })),
    });
  } catch (error) {
    console.error('Fetch vendors error:', error);
    const message =
      error instanceof Error && error.message.includes('MONGODB_URI')
        ? 'Database is not configured. Set MONGODB_URI in .env.local'
        : 'Failed to fetch shops. Ensure MongoDB is running or restart the dev server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { shopName, email, password, businessPhone, whatsappNumber } = body;

    if (!shopName || !email || !password || !businessPhone) {
      return NextResponse.json(
        { error: 'Shop name, email, password, and phone are required' },
        { status: 400 }
      );
    }

    const existing = await Vendor.findOne({
      $or: [{ shopName }, { email }],
    });
    if (existing) {
      return NextResponse.json(
        { error: 'A vendor with this shop name or email already exists' },
        { status: 409 }
      );
    }

    const vendor = new Vendor({
      shopName,
      email: email.toLowerCase(),
      password,
      businessPhone,
      whatsappNumber: whatsappNumber || businessPhone,
      businessStartTime: '09:00',
      businessEndTime: '19:00',
    });

    await vendor.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: vendor._id.toString(),
          shopName: vendor.shopName,
          email: vendor.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Vendor signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
