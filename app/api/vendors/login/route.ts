import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/phone and password are required' },
        { status: 400 }
      );
    }

    let query;
    if (identifier.includes('@')) {
      query = { email: identifier.toLowerCase() };
    } else if (/^[\d\s\+\-\(\)]+$/.test(identifier.replace(/[\s\-\(\)]/g, ''))) {
      query = {
        $or: [
          { businessPhone: identifier },
          { whatsappNumber: identifier },
        ],
      };
    } else {
      return NextResponse.json(
        { error: 'Please enter a valid email or phone number' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne(query);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (vendor.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
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
