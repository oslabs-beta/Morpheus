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
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
