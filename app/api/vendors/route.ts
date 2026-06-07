import { NextResponse } from 'next/server';
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
