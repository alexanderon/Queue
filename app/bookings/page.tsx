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

const statusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-800',
  waiting: 'bg-yellow-100 text-yellow-800',
  serving: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
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
        const upcoming = all
          .filter((b: any) => {
            if (b.status === 'completed' || b.status === 'cancelled') return false;
            const d = new Date(`${b.date?.split('T')[0] || b.date}T${b.time}`);
            return d > new Date();
          })
          .sort((a: any, b: any) => {
            const da = new Date(`${a.date?.split('T')[0] || a.date}T${a.time}`);
            const db = new Date(`${b.date?.split('T')[0] || b.date}T${b.time}`);
            return da.getTime() - db.getTime();
          });
        setBookings(upcoming);
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

  const formatDate = (raw: string) => {
    const d = new Date(raw?.split('T')[0] || raw);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isToday = (raw: string) => {
    const d = new Date(raw?.split('T')[0] || raw);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <Link
          href="/"
          className="inline-block text-indigo-600 hover:text-indigo-700 mb-6 text-sm"
        >
          ← Back to Home
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          {customerPhone && (
            <button
              onClick={() => {
                sessionStorage.removeItem('customerPhone');
                setCustomerPhone('');
                phoneRef.current = '';
                fetched.current = false;
                setPhoneInput('');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 underline"
            >
              Different number?
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        )}

        {!loading && !customerPhone && (
          <div className="max-w-md mx-auto">
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
          </div>
        )}

        {!loading && customerPhone && bookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-gray-600 mb-4">No upcoming bookings found for this number</p>
            <Link
              href="/book-slot"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm"
            >
              Book an Appointment
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-3">
            {bookings.map((booking, idx) => (
              <div
                key={booking.bookingId}
                className={`bg-white rounded-lg shadow p-4 ${idx === 0 ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.shopName}</h3>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                      statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span>
                    📅 {formatDate(booking.date)}
                    {isToday(booking.date) && (
                      <span className="text-indigo-600 font-semibold ml-1">Today</span>
                    )}
                  </span>
                  <span>⏰ {booking.time}</span>
                  <span>#️⃣ #{booking.queuePosition}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">{booking.bookingId}</span>
                  <Link
                    href={`/status?bookingId=${booking.bookingId}`}
                    className="text-indigo-600 font-semibold text-sm hover:underline"
                  >
                    Check Status →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
