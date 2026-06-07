# Queue Application - Setup Guide

## 📋 Prerequisites

Before you start, ensure you have the following installed:
- Node.js 18.0 or higher
- npm 9.0 or higher (or yarn/pnpm)
- Git

## 🚀 Quick Start

### 1. Clone/Setup Project

```bash
cd c:\Users\rahul\source\Queue
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WhatsApp Integration (Optional for now)
WHATSAPP_API_KEY=your_api_key
WHATSAPP_PHONE_NUMBER=your_phone_number
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🌐 Accessing the Application

### Customer Routes
- **Home**: http://localhost:3000
- **Book Appointment**: http://localhost:3000/book-slot
- **Check Status**: http://localhost:3000/status

### Vendor Routes
- **Vendor Login**: http://localhost:3000/vendor
- **Queue Management**: http://localhost:3000/vendor/queue
- **Services**: http://localhost:3000/vendor/services
- **Analytics**: http://localhost:3000/vendor/analytics
- **Settings**: http://localhost:3000/vendor/settings

### Test Booking IDs (for status checking)
- `BK1234567` - Sample booking 1
- `BK1234568` - Sample booking 2

### Vendor Test Credentials
- Shop Name: Any value
- Password: Any value (demo mode)

## 📁 Project Structure

```
app/                      - Next.js app router
├── api/                  - Backend API routes
├── book-slot/            - Customer booking
├── status/               - Status checking
└── vendor/               - Vendor dashboard

components/              - React components
├── Header.tsx           - Navigation header
├── BookingForm.tsx      - Booking form
└── StatusForm.tsx       - Status check form

lib/                     - Utilities and helpers
├── api-client.ts        - API client functions
├── utils.ts             - Utility functions
└── types.ts             - TypeScript types

public/                  - Static assets
```

## 🛠️ Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 📱 Mobile Testing

The application is mobile-first. To test:

1. **Using Chrome DevTools**:
   - Press `F12` to open DevTools
   - Click device toolbar icon (top-left)
   - Select mobile device preset

2. **Using Physical Device**:
   - Find your machine's IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
   - Visit: `http://<YOUR_IP>:3000`

## 🗄️ Database Setup (Future)

When integrating a database:

```bash
# Example with MongoDB
npm install mongodb

# Or with PostgreSQL
npm install pg
```

Update connection in environment variables.

## 🔐 Authentication Setup (Future)

To implement authentication:

1. Install NextAuth.js:
```bash
npm install next-auth
```

2. Configure in `app/api/auth/[...nextauth]/route.ts`

3. Update environment variables with OAuth credentials

## 💬 WhatsApp Integration

To enable real WhatsApp notifications:

### Option 1: Twilio
```bash
npm install twilio
```

Configure in environment:
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

### Option 2: MessageBird
```bash
npm install messagebird
```

### Option 3: WhatsApp Cloud API
Follow official WhatsApp documentation for API integration.

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear .next folder
rm -rf .next

# Rebuild
npm run build
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🔗 Next Steps

1. **Database Integration**: Connect to MongoDB/PostgreSQL
2. **Authentication**: Implement user login
3. **WhatsApp API**: Integrate real WhatsApp notifications
4. **Payment**: Add Razorpay/Stripe integration
5. **Deployment**: Deploy to Vercel, AWS, or your hosting

## 🤝 Support

For issues or questions:
1. Check existing documentation
2. Review API route implementations
3. Check browser console for errors
4. Review Next.js logs in terminal

---

**Happy Development! 🚀**
