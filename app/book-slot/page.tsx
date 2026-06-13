'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import Link from 'next/link';
import { bookingAPI } from '@/lib/api-client';
import { BookingCreateResponse, BookingForm as BookingFormData } from '@/lib/types';

export default function BookSlot() {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<BookingCreateResponse['booking'] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleBookingSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const response = await bookingAPI.create({
      shopId: data.shopId,
      shopName: data.shopName,
      serviceId: data.serviceId,
      service: data.service,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      date: data.date,
      time: data.time,
    });

    setIsSubmitting(false);

    if (!response.success || !response.data?.booking) {
      setSubmitError(response.error || 'Failed to create booking. Please try again.');
      return;
    }

    sessionStorage.setItem('customerPhone', data.customerPhone.trim());
    setBookingData(response.data.booking);
    setBookingConfirmed(true);
  };

  if (bookingConfirmed && bookingData) {
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>

            <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Booking ID:</strong> {bookingData.bookingId}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Shop:</strong> {bookingData.shopName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Service:</strong> {bookingData.service}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Date:</strong> {formattedDate}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Time:</strong> {bookingData.time}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Queue Position:</strong> #{bookingData.queuePosition}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Estimated Wait:</strong> ~{bookingData.estimatedTime} min
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              You&apos;ll receive WhatsApp notifications about your status.
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
          <BookingForm
            onSubmit={handleBookingSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
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
