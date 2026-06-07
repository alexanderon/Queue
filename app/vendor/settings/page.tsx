'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Settings() {
  const [settings, setSettings] = useState({
    shopName: 'Elite Barber Shop',
    whatsappNumber: '+91 98765 43210',
    notifyBeforeMinutes: '10',
    enablePredictions: true,
    businessStartTime: '10:00',
    businessEndTime: '20:00',
  });

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
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

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <div className="space-y-6">
            {/* Shop Settings */}
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
                    onChange={(e) => handleChange('shopName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
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

            {/* WhatsApp Settings */}
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

            {/* AI Settings */}
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
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Save Settings
            </button>
            <button
              onClick={() =>
                setSettings({
                  shopName: 'Elite Barber Shop',
                  whatsappNumber: '+91 98765 43210',
                  notifyBeforeMinutes: '10',
                  enablePredictions: true,
                  businessStartTime: '10:00',
                  businessEndTime: '20:00',
                })
              }
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
