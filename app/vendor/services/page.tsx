'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface Service {
  id: number;
  name: string;
  estimatedTime: number;
  price: number;
  active: boolean;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Haircut', estimatedTime: 30, price: 500, active: true },
    { id: 2, name: 'Beard Trim', estimatedTime: 15, price: 200, active: true },
    { id: 3, name: 'Hair Color', estimatedTime: 60, price: 1500, active: true },
    { id: 4, name: 'Massage', estimatedTime: 45, price: 800, active: true },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    estimatedTime: '',
    price: '',
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.name.trim()) {
      setServices([
        ...services,
        {
          id: Math.max(...services.map((s) => s.id)) + 1,
          name: newService.name,
          estimatedTime: parseInt(newService.estimatedTime) || 30,
          price: parseFloat(newService.price) || 0,
          active: true,
        },
      ]);
      setNewService({ name: '', estimatedTime: '', price: '' });
      setShowForm(false);
    }
  };

  const toggleServiceActive = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm"
          >
            + Add Service
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Service</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="e.g., Haircut"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time (min)
                  </label>
                  <input
                    type="number"
                    value={newService.estimatedTime}
                    onChange={(e) =>
                      setNewService({ ...newService, estimatedTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600">
                  ⏱️ {service.estimatedTime} min | 💰 ₹{service.price}
                </p>
              </div>
              <button
                onClick={() => toggleServiceActive(service.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  service.active
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {service.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
