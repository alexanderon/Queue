# Queue - Mobile First Appointment Booking System

A modern, mobile-first web application built with Next.js that allows users to book appointment slots and vendors to manage their queues efficiently.

## 🎯 Features

### For Customers
- **Easy Slot Booking**: Browse available time slots and book appointments instantly
- **Real-time Status Updates**: Check your queue position and estimated wait time
- **WhatsApp Notifications**: Get real-time alerts about your turn with automatic reminders
- **One-Click Confirmation**: Confirm your appointment status directly from WhatsApp
- **Multiple Services**: Support for various services (haircut, beard trim, color, etc.)

### For Vendors
- **Queue Management**: Real-time view of customers in queue with status updates
- **Service Management**: Add/edit services with estimated processing time
- **Analytics & Insights**: View business metrics and AI-powered predictions
- **Smart Notifications**: Automatic WhatsApp notifications to customers
- **Business Hours**: Configure working hours and notification preferences
- **Predictive Analysis**: AI learns from historical data to improve time estimates

### Core Technology
- ✅ Mobile-first responsive design
- ✅ Built with Next.js 14 & React 18
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ REST API with dynamic routes
- ✅ Optimized for mobile devices

## 📁 Project Structure

```
Queue/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── bookings/          # Booking management
│   │   ├── notifications/     # WhatsApp notifications
│   │   └── vendors/           # Vendor management
│   ├── book-slot/             # Booking page
│   ├── vendor/                # Vendor dashboard
│   │   ├── queue/             # Queue management
│   │   ├── services/          # Service management
│   │   ├── analytics/         # Business analytics
│   │   └── settings/          # Settings
│   ├── status/                # Check booking status
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/                 # Reusable components
│   ├── Header.tsx
│   ├── BookingForm.tsx
│   └── StatusForm.tsx
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Run the development server**
```bash
npm run dev
```

3. **Open in browser**
Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## 📱 User Flows

### Customer Journey
1. Visit home page (/)
2. Click "Book an Appointment"
3. Select shop, service, date & time
4. Enter contact details
5. Receive booking confirmation with booking ID
6. Visit "Check Status" anytime to view queue position
7. Receive WhatsApp notifications when turn is near

### Vendor Journey
1. Login to vendor dashboard (/vendor)
2. Manage queue in real-time
3. Update service list and pricing
4. View analytics and predictions
5. Configure notification settings
6. Receive automated queue updates

## 🔌 API Endpoints

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get booking status

### Notifications
- `POST /api/notifications/whatsapp` - Send WhatsApp message

### Vendor Queue
- `GET /api/vendors/[vendorId]/queue` - Get vendor queue
- `PUT /api/vendors/[vendorId]/queue` - Update queue status

## 🛠️ Technology Stack

- **Framework**: Next.js 14
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API**: Next.js API Routes
- **Mobile**: Responsive design (mobile-first approach)

## 📊 Key Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page with features |
| Book Slot | `/book-slot` | Create new appointment |
| Check Status | `/status` | View booking status |
| Vendor Dashboard | `/vendor` | Vendor control panel |
| Queue Management | `/vendor/queue` | Manage queue |
| Services | `/vendor/services` | Manage services |
| Analytics | `/vendor/analytics` | View insights |
| Settings | `/vendor/settings` | Configure vendor |

## 🔐 Authentication (To Be Implemented)

- Customer registration with phone number
- Vendor authentication with email/password
- Session management
- OAuth integration (Google, WhatsApp)

## 💬 WhatsApp Integration (To Be Implemented)

The app is designed to work with WhatsApp APIs:

### Supported Providers:
- Twilio
- MessageBird
- WhatsApp Cloud API
- AWS SNS

### Integration Points:
1. Send booking confirmation
2. Notify about queue position
3. Alert when turn is coming (10 min before)
4. Request confirmation via quick replies
5. Send completion notification

## 🤖 AI & Predictive Analysis (To Be Implemented)

- Historical data analysis
- Wait time prediction
- Service duration estimation
- Peak hours identification
- Staff optimization recommendations

## 📈 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Payment integration (Razorpay, Stripe)
- [ ] Reviews & ratings system
- [ ] Multiple language support
- [ ] Push notifications
- [ ] Loyalty program
- [ ] Staff management
- [ ] Multi-location support
- [ ] Advanced analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Queuing! 📍**
