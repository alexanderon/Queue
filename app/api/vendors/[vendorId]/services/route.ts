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

    const services = await Service.find({ vendorId }).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: services.map((service) => ({
        id: service._id.toString(),
        name: service.name,
        estimatedTime: service.estimatedTime,
        price: service.price,
        active: service.active,
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

export async function POST(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    await connectDB();
    const { vendorId } = params;
    const body = await request.json();
    const { name, estimatedTime, price } = body;

    if (!name || !estimatedTime || !price) {
      return NextResponse.json(
        { error: 'Name, estimated time, and price are required' },
        { status: 400 }
      );
    }

    if (estimatedTime < 1) {
      return NextResponse.json({ error: 'Estimated time must be at least 1 minute' }, { status: 400 });
    }

    if (price < 0) {
      return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const service = new Service({
      vendorId,
      name,
      estimatedTime,
      price,
      active: true,
    });

    await service.save();

    vendor.services.push(service._id);
    await vendor.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: service._id.toString(),
          name: service.name,
          estimatedTime: service.estimatedTime,
          price: service.price,
          active: service.active,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
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
    const { id, name, estimatedTime, price, active } = body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    if (name !== undefined) service.name = name;
    if (estimatedTime !== undefined) service.estimatedTime = estimatedTime;
    if (price !== undefined) service.price = price;
    if (active !== undefined) service.active = active;

    await service.save();

    return NextResponse.json({
      success: true,
      data: {
        id: service._id.toString(),
        name: service.name,
        estimatedTime: service.estimatedTime,
        price: service.price,
        active: service.active,
      },
    });
  } catch (error) {
    console.error('Update service error:', error);
    const message =
      error instanceof Error && error.message.includes('Cast to ObjectId')
        ? 'Invalid service or vendor ID'
        : 'Failed to update service.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
