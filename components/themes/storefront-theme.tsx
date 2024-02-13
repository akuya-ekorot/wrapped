'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function StoreFrontTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('wrapped');
  }, [setTheme]);

  return <div>{children}</div>;
}
