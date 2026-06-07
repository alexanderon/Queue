'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function Analytics() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Today's Customers</p>
            <p className="text-3xl font-bold text-indigo-600">24</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Avg. Service Time</p>
            <p className="text-3xl font-bold text-green-600">32 min</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Queue Wait Time</p>
            <p className="text-3xl font-bold text-orange-600">18 min</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Prediction Accuracy</p>
            <p className="text-3xl font-bold text-purple-600">89%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Service Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Haircut</span>
                <span className="text-sm text-gray-600">28 bookings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Beard Trim</span>
                <span className="text-sm text-gray-600">15 bookings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Hair Color</span>
                <span className="text-sm text-gray-600">12 bookings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">📊 AI Insights</h3>
          <ul className="text-sm text-blue-900 space-y-1">
            <li>• Peak hours: 11 AM - 1 PM (highest demand)</li>
            <li>• Haircut service takes ~2 min longer than average on Saturdays</li>
            <li>• Consider adding staff on weekends to reduce wait times</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
