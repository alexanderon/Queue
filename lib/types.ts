/**
 * Type definitions for Queue application
 */

export interface Booking {
  bookingId: string;
  shopName: string;
  service: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  status: 'confirmed' | 'serving' | 'completed' | 'cancelled';
  queuePosition: number;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: number;
  name: string;
  estimatedTime: number;
  price: number;
  active: boolean;
}

export interface QueueItem {
  id: number;
  name: string;
  service: string;
  position: number;
  arrivalTime: string;
  status: 'waiting' | 'serving' | 'completed';
  estimatedTime: number;
  bookingId: string;
}

export interface Vendor {
  id: string;
  shopName: string;
  email: string;
  whatsappNumber: string;
  businessStartTime: string;
  businessEndTime: string;
  notifyBeforeMinutes: number;
  enablePredictions: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  bookings: Booking[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPayload {
  bookingId: string;
  phoneNumber: string;
  message: string;
  notificationType: 'confirmation' | 'status_update' | 'reminder' | 'completion';
}

export interface QueueStats {
  totalInQueue: number;
  currentlyServing: QueueItem | null;
  averageWaitTime: number;
  peakHours: string[];
  predictionAccuracy: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BookingForm {
  shopId: string;
  shopName: string;
  serviceId: string;
  service: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
}

export interface BookingCreateResponse {
  success: boolean;
  booking: {
    bookingId: string;
    shopName: string;
    service: string;
    date: string;
    time: string;
    customerName: string;
    customerPhone: string;
    status: string;
    queuePosition: number;
    estimatedTime: number;
    createdAt: string;
  };
}

export interface VendorSettings {
  shopName: string;
  email?: string;
  businessPhone?: string;
  whatsappNumber: string;
  notifyBeforeMinutes: string;
  enablePredictions: boolean;
  businessStartTime: string;
  businessEndTime: string;
}

export interface AnalyticsData {
  todayCustomers: number;
  avgServiceTime: number;
  avgWaitTime: number;
  predictionAccuracy: number;
  servicePerformance: { name: string; bookings: number; percentage: number }[];
}
