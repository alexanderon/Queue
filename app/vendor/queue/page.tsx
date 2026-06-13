'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { vendorAPI } from '@/lib/api-client';

interface QueueItem {
  id: string;
  bookingId: string;
  name: string;
  service: string;
  position: number;
  arrivalTime: string;
  status: 'confirmed' | 'waiting' | 'serving' | 'completed';
  estimatedTime: number;
}

export default function QueueManagement() {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const vendorId = typeof window !== 'undefined' ? sessionStorage.getItem('vendorId') : null;

  useEffect(() => {
    if (!vendorId) {
      router.push('/vendor');
      return;
    }
    fetchQueue();
  }, [vendorId, router]);

  const fetchQueue = async () => {
    if (!vendorId) return;
    setLoading(true);
    const res = await vendorAPI.getQueue(vendorId);
    if (res.success && res.data) {
      setQueue((res.data as any).queue || []);
    } else {
      setError(res.error || 'Failed to fetch queue');
    }
    setLoading(false);
  };

  const updateStatus = async (bookingId: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'confirmed' ? 'serving' :
      currentStatus === 'serving' ? 'completed' :
      'serving';

    const res = await vendorAPI.updateQueue(vendorId!, { bookingId, status: nextStatus });
    if (res.success && res.data) {
      setQueue((res.data as any).queue || []);
    } else {
      setError(res.error || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'serving':
        return 'bg-green-100 text-green-800';
      case 'waiting':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16 text-center text-gray-500">Loading queue...</div>
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

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Queue Management</h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {queue.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No customers in queue
                    </td>
                  </tr>
                ) : (
                  queue.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-indigo-600">
                        #{item.position}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.service}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.status !== 'completed' && (
                          <button
                            onClick={() => updateStatus(item.bookingId, item.status)}
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                          >
                            {item.status === 'serving' ? 'Complete' : 'Start Serving'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-900">
            💡 Tip: Update customer status as they move through the queue. Customers will receive
            WhatsApp notifications automatically.
          </p>
        </div>
      </div>
    </main>
  );
}
