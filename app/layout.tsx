import '../style/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Amazon Price Tracker',
  description: 'Track and get notified for your fav products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body className={`${inter.className}`}>
        <UserProvider>
        {children}
      <Toaster />
        </UserProvider>
        
      </body>
    </html>
  );
}
