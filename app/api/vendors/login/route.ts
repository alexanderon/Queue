import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { shopName, password } = await request.json();

    if (!shopName || !password) {
      return NextResponse.json(
        { error: 'Shop name and password are required' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ shopName });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Invalid shop name or password' },
        { status: 401 }
      );
    }

    if (vendor.password !== password) {
      return NextResponse.json(
        { error: 'Invalid shop name or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: vendor._id.toString(),
        shopName: vendor.shopName,
        email: vendor.email,
      },
    });
  } catch (error) {
    console.error('Vendor login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
