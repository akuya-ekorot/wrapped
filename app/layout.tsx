import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import NextAuthProvider from '@/lib/auth/Provider';
import CartProvider from '@/components/CartProvider';
import { Toaster } from '@/components/ui/sonner';
import CustomerProvider from '@/components/CustomerProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <CustomerProvider>
              <CartProvider>{children}</CartProvider>
            </CustomerProvider>
          </NextAuthProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
