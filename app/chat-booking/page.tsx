'use client';

import Header from '@/components/Header';
import ChatBooking from '@/components/ChatBooking';
import Link from 'next/link';

export default function ChatBookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="mb-4">
            <Link
              href="/book-slot"
              className="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              ← Prefer the standard booking form instead?
            </Link>
          </div>
          <ChatBooking />
        </div>
      </div>
    </main>
  );
}
