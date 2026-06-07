/**
 * Constants for Queue application
 */

export const SHOP_NAMES = [
  'Elite Barber Shop',
  'Pro Salon',
  'Style Studio',
  'Groom House',
  'Modern Cuts',
  'Premium Salon',
];

export const SERVICES = [
  { name: 'Haircut', duration: 30, price: 500 },
  { name: 'Beard Trim', duration: 15, price: 200 },
  { name: 'Hair Color', duration: 60, price: 1500 },
  { name: 'Massage', duration: 45, price: 800 },
  { name: 'Facial', duration: 40, price: 1000 },
  { name: 'Hair Spa', duration: 50, price: 1200 },
];

export const QUEUE_STATUS = {
  WAITING: 'waiting',
  SERVING: 'serving',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const NOTIFICATION_TYPES = {
  CONFIRMATION: 'confirmation',
  STATUS_UPDATE: 'status_update',
  REMINDER: 'reminder',
  COMPLETION: 'completion',
} as const;

export const BUSINESS_HOURS = {
  EARLY_MORNING: '06:00',
  MORNING: '09:00',
  AFTERNOON: '12:00',
  EVENING: '18:00',
  NIGHT: '21:00',
} as const;

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
] as const;

export const DAYS_AHEAD = 7; // Allow booking 7 days in advance

export const NOTIFICATION_REMINDER_MINUTES = 10; // Notify 10 min before

export const DEFAULT_SERVICE_DURATION = 30; // minutes

export const MAX_QUEUE_POSITION = 50; // Max customers in queue

export const API_ENDPOINTS = {
  BOOKINGS: '/api/bookings',
  BOOKINGS_STATUS: (id: string) => `/api/bookings/${id}`,
  NOTIFICATIONS_WHATSAPP: '/api/notifications/whatsapp',
  VENDOR_QUEUE: (vendorId: string) => `/api/vendors/${vendorId}/queue`,
} as const;

export const ERROR_MESSAGES = {
  BOOKING_FAILED: 'Failed to create booking. Please try again.',
  STATUS_FETCH_FAILED: 'Failed to fetch booking status. Please try again.',
  NOTIFICATION_FAILED: 'Failed to send notification. Please try again.',
  INVALID_BOOKING_ID: 'Invalid booking ID. Please check and try again.',
  SHOP_NOT_FOUND: 'Shop not found.',
  SERVICE_NOT_FOUND: 'Service not found.',
} as const;

export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  STATUS_UPDATED: 'Status updated successfully!',
  NOTIFICATION_SENT: 'Notification sent successfully!',
} as const;

export const COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#ec4899',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6',
} as const;

export const REGEX_PATTERNS = {
  PHONE: /^(\+\d{1,3})?\s?(\d{10}|\d{12})$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const;
