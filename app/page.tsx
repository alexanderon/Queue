'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { bookingAPI } from '@/lib/api-client';

interface BookingDisplay {
  bookingId: string;
  shopName: string;
  service: string;
  date: string;
  time: string;
  customerName: string;
  status: string;
  queuePosition: number;
  estimatedTime: number;
}

function isUpcoming(booking: any): boolean {
  if (booking.status === 'completed' || booking.status === 'cancelled') return false;
  const bookingDate = new Date(`${booking.date?.split('T')[0] || booking.date}T${booking.time}`);
  return bookingDate > new Date();
}

function sortByDateTime(bookings: BookingDisplay[]): BookingDisplay[] {
  return [...bookings].sort((a, b) => {
    const da = new Date(`${a.date?.split('T')[0] || a.date}T${a.time}`);
    const db = new Date(`${b.date?.split('T')[0] || b.date}T${b.time}`);
    return da.getTime() - db.getTime();
  });
}

export default function Home() {
  const [nearestBooking, setNearestBooking] = useState<BookingDisplay | null>(null);
  const [moreCount, setMoreCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchBookings = async () => {
      const res = await bookingAPI.list({ limit: 50 });
      if (res.success && res.data) {
        const all = (res.data as any).data || [];
        const upcoming = sortByDateTime(all.filter(isUpcoming));
        if (upcoming.length > 0) {
          setNearestBooking(upcoming[0]);
          setMoreCount(upcoming.length - 1);
        }
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />

      <div className="container mx-auto px-4 pt-8 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            📍 Queue
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Skip the wait. Plan your time smartly.
          </p>
        </section>

        {/* Nearest Booking */}
        {loading && (
          <section className="max-w-md mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          </section>
        )}

        {!loading && nearestBooking && (
          <section className="max-w-md mx-auto mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <p className="text-sm font-medium text-indigo-100 mb-1">Next Appointment</p>
              <h2 className="text-xl font-bold mb-3">{nearestBooking.shopName}</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-indigo-100">Service</span>
                  <span className="font-semibold">{nearestBooking.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">Booking ID</span>
                  <span className="font-semibold text-indigo-200 text-xs">{nearestBooking.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">Date</span>
                  <span className="font-semibold">
                    {new Date(nearestBooking.date?.split('T')[0] || nearestBooking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">Time</span>
                  <span className="font-semibold">{nearestBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">Queue</span>
                  <span className="font-semibold">#{nearestBooking.queuePosition}</span>
                </div>
              </div>
              <Link
                href={`/status?bookingId=${nearestBooking.bookingId}`}
                className="block w-full text-center bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition text-sm"
              >
                Check Status
              </Link>
            </div>
            {moreCount > 0 && (
              <Link
                href="/bookings"
                className="block w-full text-center bg-indigo-100 text-indigo-700 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition text-sm mt-2"
              >
                +{moreCount} More Booking{moreCount > 1 ? 's' : ''}
              </Link>
            )}
          </section>
        )}

        {!loading && !nearestBooking && (
          <section className="max-w-md mx-auto mb-8 text-center">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-gray-600">No upcoming bookings</p>
              <Link
                href="/book-slot"
                className="mt-3 inline-block text-indigo-600 font-semibold text-sm hover:underline"
              >
                Book your first appointment →
              </Link>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold text-lg mb-2">Book Your Slot</h3>
            <p className="text-gray-600 text-sm">
              Browse available time slots and book your appointment instantly.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="font-bold text-lg mb-2">Check Status</h3>
            <p className="text-gray-600 text-sm">
              Get real-time updates on your queue position and estimated wait time.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">WhatsApp Notifications</h3>
            <p className="text-gray-600 text-sm">
              Receive alerts when your turn is coming up. Confirm via WhatsApp.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Smart Predictions</h3>
            <p className="text-gray-600 text-sm">
              AI-powered time estimates get smarter with every appointment.
            </p>
          </div>
        </section>

        {/* CTA Buttons */}
        <section className="flex flex-col gap-3 max-w-md mx-auto">
          <Link
            href="/book-slot"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-indigo-700 transition"
          >
            Book an Appointment
          </Link>
          <Link
            href="/vendor"
            className="bg-white text-indigo-600 py-3 px-6 rounded-lg font-semibold text-center border-2 border-indigo-600 hover:bg-indigo-50 transition"
          >
            Are You a Vendor?
          </Link>
          <Link
            href="/status"
            className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-300 transition"
          >
            Check Status
          </Link>
        </section>
      </div>
    </main>
  );
}
