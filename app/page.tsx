'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { bookingAPI } from '@/lib/api-client';
import { isValidWhatsAppNumber } from '@/lib/utils';

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
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const fetched = useRef(false);
  const phoneRef = useRef(customerPhone);

  useEffect(() => {
    const stored = sessionStorage.getItem('customerPhone') || '';
    setCustomerPhone(stored);
    phoneRef.current = stored;
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    if (!phoneRef.current) {
      setLoading(false);
      return;
    }
    fetched.current = true;

    const fetchBookings = async () => {
      const res = await bookingAPI.list({ limit: 50, phone: phoneRef.current });
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
  }, [customerPhone]);

  const validatePhoneInput = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && !isValidWhatsAppNumber(trimmed)) {
      setPhoneError('Enter a valid phone number (e.g., +91 9876543210)');
      setIsPhoneValid(false);
    } else if (trimmed.length > 0 && isValidWhatsAppNumber(trimmed)) {
      setPhoneError('');
      setIsPhoneValid(true);
    } else {
      setPhoneError('');
      setIsPhoneValid(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phoneInput.trim();
    if (!trimmed || !isValidWhatsAppNumber(trimmed)) return;
    sessionStorage.setItem('customerPhone', trimmed);
    setCustomerPhone(trimmed);
    phoneRef.current = trimmed;
    fetched.current = false;
    setLoading(true);
  };

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

        {!loading && customerPhone && (
          <p className="text-center text-xs text-gray-500 mb-2">
            Phone: {customerPhone}{' '}
            <button
              onClick={() => {
                sessionStorage.removeItem('customerPhone');
                setCustomerPhone('');
                phoneRef.current = '';
                fetched.current = false;
                setPhoneInput('');
                setNearestBooking(null);
                setMoreCount(0);
              }}
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              (change)
            </button>
          </p>
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

        {!loading && !customerPhone && (
          <section className="max-w-md mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Find Your Bookings</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter your phone number to look up your appointments.
              </p>
              <form onSubmit={handlePhoneSubmit} className="flex gap-2">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => { setPhoneInput(e.target.value); validatePhoneInput(e.target.value); }}
                  placeholder="Enter phone number"
                  className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                <button
                  type="submit"
                  disabled={!isPhoneValid}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  Look Up
                </button>
              </form>
              {phoneError && (
                <p className="text-red-600 text-xs mt-2">{phoneError}</p>
              )}
            </div>
          </section>
        )}

        {!loading && customerPhone && !nearestBooking && (
          <section className="max-w-md mx-auto mb-8 text-center">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-gray-600">No upcoming bookings for this number</p>
              <Link
                href="/book-slot"
                className="mt-3 inline-block text-indigo-600 font-semibold text-sm hover:underline"
              >
                Book an appointment →
              </Link>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link href="/chat-booking" className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">Chat Booking</h3>
            <p className="text-gray-600 text-sm">
              Book your appointment through a conversational chat interface — quick & easy!
            </p>
          </Link>

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
            href="/chat-booking"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-indigo-700 transition"
          >
            Chat Booking 💬
          </Link>
          <Link
            href="/book-slot"
            className="bg-white text-indigo-600 py-3 px-6 rounded-lg font-semibold text-center border-2 border-indigo-600 hover:bg-indigo-50 transition"
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
