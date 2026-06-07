'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function VendorHome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorName.trim() && password.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vendor Login</h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter your shop name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Login
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account? <a href="#" className="text-indigo-600 hover:text-indigo-700">Sign up here</a>
            </p>

            <Link
              href="/"
              className="block text-center text-indigo-600 hover:text-indigo-700 mt-6 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {vendorName}!</h1>
            <p className="text-gray-600">Manage your shop, services, and queue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/vendor/queue"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-decoration-none"
            >
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Manage Queue</h3>
              <p className="text-gray-600 text-sm">View customers, manage order, update status</p>
            </Link>

            <Link
              href="/vendor/services"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-decoration-none"
            >
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Services</h3>
              <p className="text-gray-600 text-sm">Add/edit services and estimated time</p>
            </Link>

            <Link
              href="/vendor/analytics"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-decoration-none"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">View insights and predictions</p>
            </Link>

            <Link
              href="/vendor/settings"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-decoration-none"
            >
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600 text-sm">Configure your shop and notifications</p>
            </Link>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
