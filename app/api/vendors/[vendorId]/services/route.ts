import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/lib/models/Service';
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
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const services = await Service.find({ vendorId, active: true }).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: services.map((service) => ({
        id: service._id.toString(),
        name: service.name,
        estimatedTime: service.estimatedTime,
        price: service.price,
      })),
    });
  } catch (error) {
    console.error('Fetch services error:', error);
    const message =
      error instanceof Error && error.message.includes('Cast to ObjectId')
        ? 'Invalid shop selected'
        : 'Failed to fetch services. Ensure MongoDB is running or restart the dev server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
