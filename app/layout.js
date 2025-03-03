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
      <body className={`${inter.className} h-full flex flex-col`}>
        <div className="flex-grow flex flex-col">
          {/* Conditionally render Navbar */}
          {!hideNavbarPaths.includes(pathname) && <Navbar />}
          <main className="flex-grow py-10">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
          <Toaster />
        </div>
        {/* Footer always at the bottom */}
      </body>
    </html>
  );
}


