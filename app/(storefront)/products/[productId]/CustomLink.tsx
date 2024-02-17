'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function CustomLink({
  name,
  value,
  children,
  disabled,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  }, [searchParams]);

  if (disabled) {
    return <>{children}</>;
  }

  return <Link href={`${pathname}?${createQueryString()}`}>{children}</Link>;
}
