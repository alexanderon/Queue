'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { vendorAPI } from '@/lib/api-client';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">Loading map...</div>,
});
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    shopName: '',
    whatsappNumber: '',
    notifyBeforeMinutes: '15',
    enablePredictions: true,
    businessStartTime: '09:00',
    businessEndTime: '19:00',
    address: '',
    city: '',
    state: '',
    pincode: '',
    location: { lat: 0, lng: 0 } as { lat: number; lng: number },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const vendorId = typeof window !== 'undefined' ? sessionStorage.getItem('vendorId') : null;

  useEffect(() => {
    if (!vendorId) {
      router.push('/vendor');
      return;
    }
    fetchSettings();
  }, [vendorId, router]);

  const fetchSettings = async () => {
    if (!vendorId) return;
    setLoading(true);
    const res = await vendorAPI.getSettings(vendorId);
    if (res.success && res.data) {
      const d = res.data as any;
      setSettings({
        shopName: d.data.shopName || '',
        whatsappNumber: d.data.whatsappNumber || '',
        notifyBeforeMinutes: d.data.notifyBeforeMinutes || '15',
        enablePredictions: d.data.enablePredictions !== undefined ? d.data.enablePredictions : true,
        businessStartTime: d.data.businessStartTime || '09:00',
        businessEndTime: d.data.businessEndTime || '19:00',
        address: d.data.address || '',
        city: d.data.city || '',
        state: d.data.state || '',
        pincode: d.data.pincode || '',
        location: d.data.location || { lat: 0, lng: 0 },
      });
    } else {
      setError(res.error || 'Failed to fetch settings');
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!vendorId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    const res = await vendorAPI.updateSettings(vendorId, {
      whatsappNumber: settings.whatsappNumber,
      notifyBeforeMinutes: settings.notifyBeforeMinutes,
      enablePredictions: settings.enablePredictions,
      businessStartTime: settings.businessStartTime,
      businessEndTime: settings.businessEndTime,
      address: settings.address,
      city: settings.city,
      state: settings.state,
      pincode: settings.pincode,
      location: settings.location.lat ? settings.location : undefined,
    });
    if (res.success) {
      setSuccess('Settings saved successfully!');
      if (res.data) {
        const d = res.data as any;
        sessionStorage.setItem('vendorName', d.data.shopName);
      }
    } else {
      setError(res.error || 'Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16 text-center text-gray-500">Loading settings...</div>
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

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">{success}</div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                Shop Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={settings.shopName}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={settings.businessStartTime}
                      onChange={(e) => handleChange('businessStartTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={settings.businessEndTime}
                      onChange={(e) => handleChange('businessEndTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                Business Address
              </h2>
              <div className="space-y-3">
                <AddressAutocomplete
                  value={settings.address}
                  onChange={(val) => handleChange('address', val)}
                  onLocationSelect={(loc) => handleChange('location', loc)}
                  onCityChange={(val) => handleChange('city', val)}
                  onStateChange={(val) => handleChange('state', val)}
                  onPincodeChange={(val) => handleChange('pincode', val)}
                  placeholder="Street address"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={settings.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
                    placeholder="State"
                  />
                </div>
                <input
                  type="text"
                  value={settings.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
                  placeholder="Pincode"
                />
                <details className="text-sm">
                  <summary className="text-indigo-600 cursor-pointer hover:text-indigo-700 font-medium">
                    Pick location on map
                  </summary>
                  <div className="mt-3">
                    <LocationPicker
                      onAddressChange={(addr) => handleChange('address', addr)}
                      onLocationChange={(loc) => handleChange('location', loc)}
                      initialAddress={settings.address}
                      initialLocation={settings.location.lat ? settings.location : undefined}
                    />
                  </div>
                </details>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                WhatsApp Notifications
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Business Number
                  </label>
                  <input
                    type="tel"
                    value={settings.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notify Customer Before (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.notifyBeforeMinutes}
                    onChange={(e) => handleChange('notifyBeforeMinutes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    min="5"
                    max="60"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                AI & Predictions
              </h2>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Enable Predictive Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Use AI to improve estimated wait times
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enablePredictions}
                  onChange={(e) => handleChange('enablePredictions', e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={fetchSettings}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
