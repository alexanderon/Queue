import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  bookings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);
