import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  shopId: mongoose.Types.ObjectId;
  shopName: string;
  serviceId: mongoose.Types.ObjectId;
  service: string;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'waiting' | 'serving' | 'completed' | 'cancelled';
  queuePosition: number;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'waiting', 'serving', 'completed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    queuePosition: {
      type: Number,
      default: 0,
    },
    estimatedTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
