import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './components/Header/Header'; // Adjust this path as necessary
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Morpheus',
  description:
    'A Docker, kubernetes visualizer and dashboard tool with AI integration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
