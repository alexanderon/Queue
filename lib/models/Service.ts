import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  estimatedTime: number;
  price: number;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
