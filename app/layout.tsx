import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import NextAuthProvider from '@/lib/auth/Provider';
import CartProvider from '@/components/CartProvider';
import { Toaster } from '@/components/ui/sonner';
import CustomerProvider from '@/components/CustomerProvider';
import { env } from '@/lib/env.mjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME ?? 'Create Next App',
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
