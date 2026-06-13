'use client';

import Link from 'next/link';
import { PrimaryButton } from '@fluentui/react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }} className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold" style={{ color: '#0078d4' }}>
          📍 Queue
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm" style={{ color: '#424242', textDecoration: 'none' }}>
            Home
          </Link>
          <Link href="/chat-booking" className="text-sm" style={{ color: '#424242', textDecoration: 'none' }}>
            Chat Booking
          </Link>
          <Link href="/book-slot" className="text-sm" style={{ color: '#424242', textDecoration: 'none' }}>
            Book Slot
          </Link>
          <Link href="/status" className="text-sm" style={{ color: '#424242', textDecoration: 'none' }}>
            Check Status
          </Link>
          <Link href="/vendor" className="text-sm" style={{ color: '#424242', textDecoration: 'none' }}>
            Vendor
          </Link>
        </nav>
      </div>
    </header>
  );
}
