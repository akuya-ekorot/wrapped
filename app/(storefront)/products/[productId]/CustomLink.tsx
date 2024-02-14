'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function CustomLink({
  name,
  value,
  children,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  }, [searchParams]);

  return <Link href={`${pathname}?${createQueryString()}`}>{children}</Link>;
}
