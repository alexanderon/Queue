import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  shopName: string;
  email: string;
  password: string;
  businessPhone: string;
  whatsappNumber: string;
  businessStartTime: string;
  businessEndTime: string;
  notifyBeforeMinutes: number;
  enablePredictions: boolean;
  address: string;
  city: string;
  state: string;
  pincode: string;
  services: mongoose.Types.ObjectId[];
  currentQueue: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    shopName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    businessPhone: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    businessStartTime: {
      type: String,
      default: '09:00',
    },
    businessEndTime: {
      type: String,
      default: '19:00',
    },
    notifyBeforeMinutes: {
      type: Number,
      default: 15,
    },
    enablePredictions: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    currentQueue: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', vendorSchema);
