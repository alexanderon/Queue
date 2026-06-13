import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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

    return NextResponse.json({
      success: true,
      data: {
        shopName: vendor.shopName,
        email: vendor.email,
        businessPhone: vendor.businessPhone,
        whatsappNumber: vendor.whatsappNumber,
        notifyBeforeMinutes: String(vendor.notifyBeforeMinutes),
        enablePredictions: vendor.enablePredictions,
        businessStartTime: vendor.businessStartTime,
        businessEndTime: vendor.businessEndTime,
        address: vendor.address || '',
        city: vendor.city || '',
        state: vendor.state || '',
        pincode: vendor.pincode || '',
        location: vendor.location || { lat: 0, lng: 0 },
      },
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
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
    const {
      whatsappNumber,
      notifyBeforeMinutes,
      enablePredictions,
      businessStartTime,
      businessEndTime,
      address,
      city,
      state,
      pincode,
      location,
    } = body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    if (whatsappNumber !== undefined) vendor.whatsappNumber = whatsappNumber;
    if (notifyBeforeMinutes !== undefined) vendor.notifyBeforeMinutes = parseInt(notifyBeforeMinutes);
    if (enablePredictions !== undefined) vendor.enablePredictions = enablePredictions;
    if (businessStartTime !== undefined) vendor.businessStartTime = businessStartTime;
    if (businessEndTime !== undefined) vendor.businessEndTime = businessEndTime;
    if (address !== undefined) vendor.address = address;
    if (city !== undefined) vendor.city = city;
    if (state !== undefined) vendor.state = state;
    if (pincode !== undefined) vendor.pincode = pincode;
    if (location !== undefined) vendor.location = location;

    await vendor.save();

    return NextResponse.json({
      success: true,
      data: {
        shopName: vendor.shopName,
        email: vendor.email,
        businessPhone: vendor.businessPhone,
        whatsappNumber: vendor.whatsappNumber,
        notifyBeforeMinutes: String(vendor.notifyBeforeMinutes),
        enablePredictions: vendor.enablePredictions,
        businessStartTime: vendor.businessStartTime,
        businessEndTime: vendor.businessEndTime,
        address: vendor.address || '',
        city: vendor.city || '',
        state: vendor.state || '',
        pincode: vendor.pincode || '',
        location: vendor.location || { lat: 0, lng: 0 },
      },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
