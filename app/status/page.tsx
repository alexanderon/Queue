'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import StatusForm from '@/components/StatusForm';
import Link from 'next/link';

function StatusInner() {
  const searchParams = useSearchParams();
  const bookingIdFromUrl = searchParams.get('bookingId') || '';
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(!!bookingIdFromUrl);
  const [autoChecked, setAutoChecked] = useState(false);

  const handleCheckStatus = async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setStatus({
        bookingId: data.bookingId,
        shopName: 'Elite Barber Shop',
        queuePosition: Math.floor(Math.random() * 15) + 1,
        estimatedTime: Math.floor(Math.random() * 45) + 10,
        currentlyServing: Math.floor(Math.random() * 10),
        service: 'Haircut',
      });
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (bookingIdFromUrl && !autoChecked) {
      setAutoChecked(true);
      handleCheckStatus({ bookingId: bookingIdFromUrl });
    }
  }, [bookingIdFromUrl, autoChecked]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Check Your Status</h1>

          {loading && !status ? (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-10 bg-gray-200 rounded w-full mx-auto"></div>
              </div>
              <p className="text-gray-500 mt-4 text-sm">Fetching your booking status...</p>
            </div>
          ) : !status ? (
            <>
              <div className="mb-4">
                <StatusForm onSubmit={handleCheckStatus} loading={loading} initialBookingId={bookingIdFromUrl} />
              </div>
              <Link
                href="/"
                className="block text-center text-indigo-600 hover:text-indigo-700 mt-4 text-sm"
              >
                ← Back to Home
              </Link>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Queue Status</h2>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="text-lg font-semibold text-gray-900">{status.bookingId}</p>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">Shop</p>
                  <p className="text-lg font-semibold text-gray-900">{status.shopName}</p>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">Your Position in Queue</p>
                  <p className="text-3xl font-bold text-indigo-600">#{status.queuePosition}</p>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">Estimated Wait Time</p>
                  <p className="text-2xl font-semibold text-green-600">{status.estimatedTime} min</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Currently Serving</p>
                  <p className="text-lg font-semibold text-gray-900">Customer #{status.currentlyServing}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-sm text-blue-900">
                  💬 You&apos;ll get a WhatsApp notification 10 minutes before your turn!
                </p>
              </div>

              <button
                onClick={() => setStatus(null)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition mb-3"
              >
                Check Again
              </button>

              <Link
                href="/"
                className="block text-center text-indigo-600 hover:text-indigo-700 text-sm"
              >
                ← Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Status() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16 text-center text-gray-500">Loading...</div>
      </main>
    }>
      <StatusInner />
    </Suspense>
  );
}
