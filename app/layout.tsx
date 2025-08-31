import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"
import MaintenanceGate from '@/components/common/MaintainanceGate';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bluefield Medical',
  description: 'Medical Services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <MaintenanceGate> */}
          {children}
        {/* </MaintenanceGate> */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}