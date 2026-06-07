'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-8 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            📍 Queue
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Skip the wait. Plan your time smartly.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Get real-time notifications about your appointment slot, estimated wait time, and confirm your turn from anywhere.
          </p>
        </section>

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
