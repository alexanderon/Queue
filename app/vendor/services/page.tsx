'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { vendorAPI } from '@/lib/api-client';

interface Service {
  id: string;
  name: string;
  estimatedTime: number;
  price: number;
  active: boolean;
}

export default function ServicesManagement() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const vendorId = typeof window !== 'undefined' ? sessionStorage.getItem('vendorId') : null;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    estimatedTime: '',
    price: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!vendorId) {
      router.push('/vendor');
      return;
    }
    fetchServices();
  }, [vendorId, router]);

  const fetchServices = async () => {
    if (!vendorId) return;
    setLoading(true);
    const res = await vendorAPI.getServices(vendorId);
    if (res.success && res.data) {
      setServices((res.data as any).data || []);
    } else {
      setError(res.error || 'Failed to fetch services');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ name: '', estimatedTime: '', price: '' });
    setFormErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) errs.name = 'Service name must be at least 2 characters';
    const time = parseInt(formData.estimatedTime);
    if (!formData.estimatedTime || isNaN(time) || time < 1) errs.estimatedTime = 'Enter a valid time (min 1 minute)';
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 0) errs.price = 'Enter a valid price';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    if (editingId !== null) {
      const res = await vendorAPI.updateService(vendorId, {
        id: editingId,
        name: formData.name,
        estimatedTime: parseInt(formData.estimatedTime) || 30,
        price: parseFloat(formData.price) || 0,
      });
      if (res.success) {
        await fetchServices();
        resetForm();
      } else {
        setError(res.error || 'Failed to update service');
      }
    } else {
      const res = await vendorAPI.createService(vendorId, {
        name: formData.name,
        estimatedTime: parseInt(formData.estimatedTime) || 30,
        price: parseFloat(formData.price) || 0,
      });
      if (res.success) {
        await fetchServices();
        resetForm();
      } else {
        setError(res.error || 'Failed to create service');
      }
    }
    setSaving(false);
  };

  const toggleServiceActive = async (service: Service) => {
    if (!vendorId) return;
    setError('');
    const res = await vendorAPI.updateService(vendorId, {
      id: service.id,
      active: !service.active,
    });
    if (res.success) {
      await fetchServices();
    } else {
      setError(res.error || 'Failed to toggle service');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16 text-center text-gray-500">Loading services...</div>
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm"
          >
            + Add Service
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

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
                  onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFormErrors({}); }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Haircut"
                  required
                />
                {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent ${formErrors.estimatedTime ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="30"
                    min="1"
                  />
                  {formErrors.estimatedTime && <p className="text-red-600 text-xs mt-1">{formErrors.estimatedTime}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => { setFormData({ ...formData, price: e.target.value }); setFormErrors({}); }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="500"
                    min="0"
                  />
                  {formErrors.price && <p className="text-red-600 text-xs mt-1">{formErrors.price}</p>}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId !== null ? 'Update Service' : 'Add Service'}
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
          {services.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No services added yet. Click the Add Service button to get started.
            </div>
          )}
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
                  onClick={() => toggleServiceActive(service)}
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
