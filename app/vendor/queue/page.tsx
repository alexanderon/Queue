'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface QueueItem {
  id: number;
  name: string;
  service: string;
  position: number;
  arrivalTime: string;
  status: 'waiting' | 'serving' | 'completed';
}

export default function QueueManagement() {
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: 1,
      name: 'John Doe',
      service: 'Haircut',
      position: 1,
      arrivalTime: '10:30 AM',
      status: 'serving',
    },
    {
      id: 2,
      name: 'Jane Smith',
      service: 'Beard Trim',
      position: 2,
      arrivalTime: '10:45 AM',
      status: 'waiting',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      service: 'Hair Color',
      position: 3,
      arrivalTime: '11:00 AM',
      status: 'waiting',
    },
  ]);

  const updateStatus = (id: number) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === 'waiting'
                  ? 'serving'
                  : item.status === 'serving'
                  ? 'completed'
                  : 'waiting',
            }
          : item
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'serving':
        return 'bg-green-100 text-green-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                {queue.map((item) => (
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
                      <button
                        onClick={() => updateStatus(item.id)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
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
