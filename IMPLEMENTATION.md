# Queue Application - Implementation Guide

## Overview

This is a complete mobile-first appointment booking system built with Next.js 14. The application provides a seamless experience for both customers (to book appointments) and vendors (to manage queues).

## Architecture

### Frontend (React 18 + TypeScript)
- Mobile-first responsive design
- Client-side components for interactivity
- Tailwind CSS for styling
- Form handling with React hooks

### Backend (Next.js API Routes)
- REST API endpoints
- Server-side logic
- Request/response handling

### Database (To be implemented)
- MongoDB or PostgreSQL recommended
- Store bookings, vendors, customers, services

## Feature Implementation Guide

### 1. Customer Booking Flow ✅ (Implemented)

**Files**: 
- `app/book-slot/page.tsx`
- `components/BookingForm.tsx`
- `app/api/bookings/route.ts`

**Steps**:
1. User selects shop and service
2. Choose date and time
3. Enter contact details
4. Booking confirmation received
5. Integration point: WhatsApp notification

**To Enhance**:
```typescript
// Future: Save to database
const booking = await db.bookings.create({
  customerName,
  shopName,
  service,
  date,
  time,
  phoneNumber,
  queuePosition: calculatePosition(shopName),
  status: 'confirmed'
});
```

### 2. Status Checking ✅ (Implemented)

**Files**:
- `app/status/page.tsx`
- `components/StatusForm.tsx`
- `app/api/bookings/[id]/route.ts`

**Real-time Features**:
- Queue position display
- Estimated wait time
- Current service indicator

**To Enhance with WebSocket**:
```typescript
// Future: Real-time updates using Socket.io
const socket = io(API_URL);
socket.on('queue:updated', (data) => {
  setQueuePosition(data.position);
  setEstimatedTime(data.time);
});
```

### 3. Vendor Dashboard ✅ (Implemented)

**Files**:
- `app/vendor/page.tsx`
- `app/vendor/queue/page.tsx`
- `app/vendor/services/page.tsx`
- `app/vendor/analytics/page.tsx`
- `app/vendor/settings/page.tsx`

**Key Features**:
- Real-time queue management
- Service configuration
- Business analytics
- Settings management

**To Add Database Integration**:
```typescript
// Save vendor settings
await db.vendors.update(vendorId, {
  shopName,
  businessHours: { start, end },
  notificationSettings,
  services: serviceList
});
```

### 4. WhatsApp Integration (To be implemented)

**Current**: Placeholder in `app/api/notifications/whatsapp/route.ts`

**Implementation Options**:

#### Option A: Twilio
```bash
npm install twilio
```

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppNotification(
  to: string,
  message: string
) {
  return await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
    to: `whatsapp:${to}`,
    body: message
  });
}
```

#### Option B: WhatsApp Cloud API
```typescript
async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
) {
  const response = await fetch(
    `https://graph.instagram.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      })
    }
  );
  return response.json();
}
```

### 5. Database Integration (To be implemented)

#### Setup MongoDB:
```bash
npm install mongodb
```

Create `lib/db.ts`:
```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL);

export async function connectDB() {
  await client.connect();
  return client.db('queue');
}
```

#### Create Models:
```typescript
// Bookings collection
db.bookings.createIndex({ bookingId: 1 });
db.bookings.createIndex({ customerPhone: 1 });
db.bookings.createIndex({ shopName: 1 });

// Vendors collection
db.vendors.createIndex({ email: 1 }, { unique: true });

// Queue collection (real-time)
db.queues.createIndex({ shopName: 1 });
```

### 6. Authentication (To be implemented)

Install NextAuth.js:
```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Verify against database
        const vendor = await db.vendors.findOne({
          email: credentials?.email
        });
        
        if (vendor && password matches) {
          return { id: vendor._id, email: vendor.email };
        }
        return null;
      }
    })
  ]
};
```

### 7. AI/Predictive Analysis (To be implemented)

```typescript
// lib/predictions.ts

/**
 * Calculate predicted wait time using historical data
 */
export async function predictWaitTime(
  shopId: string,
  service: string,
  time: Date
): Promise<number> {
  // Get historical data
  const pastBookings = await db.bookings.find({
    shopName: shopId,
    service: service,
    status: 'completed'
  });

  // Calculate average service time
  const avgDuration = pastBookings.reduce(
    (sum, b) => sum + (b.endTime - b.startTime),
    0
  ) / pastBookings.length;

  // Get current queue
  const currentQueue = await getQueueLength(shopId);

  // Predict: queue length × average duration
  return currentQueue * avgDuration;
}
```

### 8. Payment Integration (To be implemented)

Install Razorpay:
```bash
npm install razorpay
```

```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createPaymentOrder(
  customerId: string,
  amount: number
) {
  return await razorpay.orders.create({
    amount: amount * 100, // Convert to paisa
    currency: 'INR',
    customer_notify: 1,
    notes: { customerId }
  });
}
```

## Code Structure Best Practices

### Component Organization
```typescript
// components/Button.tsx - Reusable components
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  // Implementation
}
```

### API Route Structure
```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle GET
}

export async function POST(request: NextRequest) {
  // Handle POST
}
```

### Error Handling
```typescript
export async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## Testing Checklist

- [ ] Customer can book appointment
- [ ] Vendor can manage queue
- [ ] Status updates correctly
- [ ] WhatsApp notifications send
- [ ] Responsive on mobile devices
- [ ] API endpoints work correctly
- [ ] Error handling works
- [ ] Database operations successful

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
DATABASE_URL=production_database_url
NEXT_PUBLIC_APP_URL=https://yourdomain.com
WHATSAPP_API_KEY=production_key
JWT_SECRET=production_secret
```

## Performance Optimization

- Image optimization with Next.js Image
- Code splitting and lazy loading
- Caching strategies
- Database query optimization
- CDN for static assets

## Security Considerations

- Input validation on all forms
- CORS configuration
- Rate limiting on API endpoints
- Secure session management
- Protect sensitive API keys
- SQL injection prevention
- XSS protection

---

**Next Steps**: Implement database, authentication, and WhatsApp integration following this guide.
