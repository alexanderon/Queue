import { NextRequest, NextResponse } from 'next/server';

// Mock queue data - in production this would be a real database
const vendorQueues: any = {
  vendor1: [
    {
      id: 1,
      name: 'John Doe',
      service: 'Haircut',
      position: 1,
      arrivalTime: '10:30 AM',
      status: 'serving',
      estimatedTime: 25,
      bookingId: 'BK1234567',
    },
    {
      id: 2,
      name: 'Jane Smith',
      service: 'Beard Trim',
      position: 2,
      arrivalTime: '10:45 AM',
      status: 'waiting',
      estimatedTime: 40,
      bookingId: 'BK1234568',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      service: 'Hair Color',
      position: 3,
      arrivalTime: '11:00 AM',
      status: 'waiting',
      estimatedTime: 100,
      bookingId: 'BK1234569',
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const { vendorId } = params;

    const queue = vendorQueues[vendorId];

    if (!queue) {
      return NextResponse.json(
        {
          vendorId,
          queue: [],
          message: 'No queue data found for this vendor',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        vendorId,
        queue,
        totalInQueue: queue.length,
        currentlyServing: queue.find((item: any) => item.status === 'serving'),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const { vendorId } = params;
    const body = await request.json();
    const { customerId, status } = body;

    if (!customerId || !status) {
      return NextResponse.json(
        { error: 'customerId and status are required' },
        { status: 400 }
      );
    }

    const queue = vendorQueues[vendorId];
    if (!queue) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Update customer status in queue
    const customer = queue.find((item: any) => item.id === customerId);
    if (customer) {
      customer.status = status;

      // TODO: Send WhatsApp notification to customer about status change
      console.log(
        `Queue status updated for customer ${customerId}: ${status}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        queue,
        message: 'Queue updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update queue' },
      { status: 500 }
    );
  }
}
