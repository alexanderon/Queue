'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { vendorAPI } from '@/lib/api-client';

export default function VendorHome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendorName, setVendorName] = useState('');

  useEffect(() => {
    const storedId = sessionStorage.getItem('vendorId');
    const storedName = sessionStorage.getItem('vendorName');
    if (storedId) {
      setIsLoggedIn(true);
      setVendorName(storedName || '');
    }
  }, []);
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupWhatsapp, setSignupWhatsapp] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const resetSignup = () => {
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupPhone('');
    setSignupWhatsapp('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);
    const res = await vendorAPI.login(vendorName, password);
    if (res.success && res.data) {
      const d = res.data as any;
      sessionStorage.setItem('vendorId', d.id);
      sessionStorage.setItem('vendorName', d.shopName);
      setVendorName(d.shopName);
      setIsLoggedIn(true);
    } else {
      setError(res.error || 'Login failed');
    }
    setLoginLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSignupLoading(true);
    const res = await vendorAPI.create({
      shopName: signupName,
      email: signupEmail,
      password: signupPassword,
      businessPhone: signupPhone,
      whatsappNumber: signupWhatsapp || undefined,
    });
    if (res.success && res.data) {
      const d = res.data as any;
      sessionStorage.setItem('vendorId', d.id);
      sessionStorage.setItem('vendorName', d.shopName);
      setVendorName(d.shopName);
      resetSignup();
      setShowSignup(false);
      setIsLoggedIn(true);
    } else {
      setError(res.error || 'Signup failed');
    }
    setSignupLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vendorId');
    sessionStorage.removeItem('vendorName');
    setIsLoggedIn(false);
    setVendorName('');
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            {!showSignup ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vendor Login</h1>

                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
                )}

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
                    disabled={loginLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loginLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-4">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => { setShowSignup(true); setError(''); }}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vendor Sign Up</h1>

                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Your shop name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone *
                    </label>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={signupWhatsapp}
                      onChange={(e) => setSignupWhatsapp(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Same as phone if blank"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {signupLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-4">
                  Already have an account?{' '}
                  <button
                    onClick={() => { setShowSignup(false); setError(''); }}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Login here
                  </button>
                </p>
              </>
            )}

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
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
