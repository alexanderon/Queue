'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { vendorAPI } from '@/lib/api-client';
import { AnalyticsData } from '@/lib/types';

export default function Analytics() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const vendorId = typeof window !== 'undefined' ? sessionStorage.getItem('vendorId') : null;

  useEffect(() => {
    if (!vendorId) {
      router.push('/vendor');
      return;
    }
    fetchAnalytics();
  }, [vendorId, router]);

  const fetchAnalytics = async () => {
    if (!vendorId) return;
    setLoading(true);
    const res = await vendorAPI.getAnalytics(vendorId);
    if (res.success && res.data) {
      setData((res.data as any).data);
    } else {
      setError(res.error || 'Failed to fetch analytics');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16 text-center text-gray-500">Loading analytics...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <Link
          href="/vendor"
          className="inline-block text-indigo-600 hover:text-indigo-700 mb-6 text-sm"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">Today&apos;s Customers</p>
                <p className="text-3xl font-bold text-indigo-600">{data.todayCustomers}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">Avg. Service Time</p>
                <p className="text-3xl font-bold text-green-600">{data.avgServiceTime} min</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">Queue Wait Time</p>
                <p className="text-3xl font-bold text-orange-600">{data.avgWaitTime} min</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-2">Prediction Accuracy</p>
                <p className="text-3xl font-bold text-purple-600">{data.predictionAccuracy}%</p>
              </div>
            </div>

            {data.servicePerformance.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="font-bold text-lg text-gray-900 mb-4">Service Performance</h2>
                <div className="space-y-4">
                  {data.servicePerformance.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{s.name}</span>
                        <span className="text-sm text-gray-600">{s.bookings} bookings</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${s.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">📊 AI Insights</h3>
              <ul className="text-sm text-blue-900 space-y-1">
                <li>• Peak hours: 11 AM - 1 PM (highest demand)</li>
                <li>• Service times vary based on queue load and service type</li>
                <li>• Consider adding staff on weekends to reduce wait times</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
