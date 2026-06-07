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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    estimatedTime: '',
    price: '',
  });

  const resetForm = () => {
    setFormData({ name: '', estimatedTime: '', price: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (service: Service) => {
    setFormData({
      name: service.name,
      estimatedTime: String(service.estimatedTime),
      price: String(service.price),
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId !== null) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: formData.name,
                estimatedTime: parseInt(formData.estimatedTime) || 30,
                price: parseFloat(formData.price) || 0,
              }
            : s
        )
      );
    } else {
      setServices([
        ...services,
        {
          id: Math.max(...services.map((s) => s.id), 0) + 1,
          name: formData.name,
          estimatedTime: parseInt(formData.estimatedTime) || 30,
          price: parseFloat(formData.price) || 0,
          active: true,
        },
      ]);
    }
    resetForm();
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId !== null ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.estimatedTime}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedTime: e.target.value })
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
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                  {editingId !== null ? 'Update Service' : 'Add Service'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
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
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(service)}
                  className="px-3 py-2 rounded-lg font-semibold text-sm transition bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  Edit
                </button>
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
