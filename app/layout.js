'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import Toaster from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Pages where the Navbar should not be shown
  const hideNavbarPaths = ['/', '/login'];

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-screen flex flex-col`}>
        {/* Conditionally render Navbar */}
        {!hideNavbarPaths.includes(pathname) && <Navbar />}

        {/* Main content container - takes full available height */}
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer always at the bottom */}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
