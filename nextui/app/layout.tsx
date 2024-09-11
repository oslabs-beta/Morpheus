import * as React from 'react';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const Header = React.lazy(() => import('./components/Header/Header'));

export const metadata: Metadata = {
  title: 'Morpheus',
  description:
    'A Docker, kubernetes visualizer and dashboard tool with AI integration',
  icons: {
    icon: [{ url: '/morpheus-logo.png', sizes: '64x64', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex flex-col min-h-screen'>
          {/* Use Suspense to handle the lazy loading */}
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
          </Suspense>
          <main className='flex-grow'>{children}</main>
        </div>
      </body>
    </html>
  );
}
