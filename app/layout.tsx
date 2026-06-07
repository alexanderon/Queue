import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Queue - Book Your Slot',
  description: 'Mobile-first web application for booking appointment slots',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
