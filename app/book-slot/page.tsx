'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import Link from 'next/link';

export default function BookSlot() {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const handleBookingSubmit = (data: any) => {
    setBookingData(data);
    setBookingConfirmed(true);
    // Here you would send data to API
    console.log('Booking submitted:', data);
  };

  if (bookingConfirmed && bookingData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Shop:</strong> {bookingData.shopName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Service:</strong> {bookingData.service}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Date:</strong> {bookingData.date}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Time:</strong> {bookingData.time}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Queue Position:</strong> #{Math.floor(Math.random() * 10) + 1}
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              You'll receive WhatsApp notifications about your status.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/status"
                className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-green-700 transition"
              >
                Check Status
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-300 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Your Slot</h1>
          <BookingForm onSubmit={handleBookingSubmit} />
          <Link
            href="/"
            className="block text-center text-indigo-600 hover:text-indigo-700 mt-4 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
