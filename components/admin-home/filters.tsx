'use client';

import { OrderStatus } from '@/lib/db/schema/orders';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div>
      <div className="flex items-center justify-end">
        <div className="px-4 space-y-2">
          <p className="text-muted-foreground text-xs">Duration</p>
          <div className="flex items-center gap-2">
            <Button size={'sm'} variant={'outline'}>
              Today
            </Button>
            <Button size={'sm'} variant={'outline'}>
              Yesterday
            </Button>
            <Button size={'sm'} variant={'outline'}>
              This week
            </Button>
            <Button size={'sm'} variant={'outline'}>
              Custom
            </Button>
          </div>
        </div>
        <div className="px-4 space-y-2">
          <p className="text-muted-foreground text-xs">Status</p>
          <Select
            name="status"
            onValueChange={(value) =>
              router.push(`${pathname}?${createQueryString('status', value)}`)
            }
          >
            <SelectTrigger className="min-w-40">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.entries(OrderStatus).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
