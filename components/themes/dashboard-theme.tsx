'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function DashboardTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, []);

  return <div>{children}</div>;
}
