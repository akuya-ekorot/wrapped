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
import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

export default function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (newParams: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(newParams)) {
        params.set(key, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleToday = () => {
    let queryString = createQueryString({
      start: DateTime.now().startOf('day').toISO(),
      end: DateTime.now().endOf('day').toISO(),
    });

    router.push(`${pathname}?${queryString}`);
  };

  const handleYesterday = () => {
    let queryString = createQueryString({
      start: DateTime.now().startOf('day').minus({ day: 1 }).toISO(),
      end: DateTime.now().endOf('day').minus({ day: 1 }).toISO(),
    });

    router.push(`${pathname}?${queryString}`);
  };

  const handleThisWeek = () => {
    let queryString = createQueryString({
      start: DateTime.now().startOf('week').toISO(),
      end: DateTime.now().endOf('week').toISO(),
    });

    router.push(`${pathname}?${queryString}`);
  };

  const [date, setDate] = React.useState<DateRange | undefined>();

  const handleDateChange = (date: DateRange | undefined) => {
    setDate({
      from: date?.from
        ? DateTime.fromJSDate(date.from).startOf('day').toJSDate()
        : undefined,
      to: date?.to
        ? DateTime.fromJSDate(date?.to ?? new Date())
            .endOf('day')
            .toJSDate()
        : undefined,
    });
  };

  const handleCustom = () => {
    let queryString = createQueryString({
      start:
        DateTime.fromJSDate(date?.from ?? new Date()).toISO() ??
        DateTime.now().startOf('month').toISO(),
      end:
        DateTime.fromJSDate(date?.to ?? new Date()).toISO() ??
        DateTime.now().endOf('month').toISO(),
    });

    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div>
      <div className="flex items-center justify-end">
        <div className="px-4 space-y-2">
          <p className="text-muted-foreground text-xs">Duration</p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleToday()}
              size={'sm'}
              variant={'outline'}
            >
              Today
            </Button>
            <Button
              onClick={() => handleYesterday()}
              size={'sm'}
              variant={'outline'}
            >
              Yesterday
            </Button>
            <Button
              onClick={() => handleThisWeek()}
              size={'sm'}
              variant={'outline'}
            >
              This week
            </Button>
            <div className={cn('grid gap-2', '')}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'w-[300px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleDateChange}
                    numberOfMonths={2}
                  />
                  <div className="p-4 flex justify-end">
                    <Button onClick={() => handleCustom()}>Filter</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="px-4 space-y-2">
          <p className="text-muted-foreground text-xs">Status</p>
          <Select
            name="status"
            onValueChange={(value) =>
              router.push(`${pathname}?${createQueryString({ status: value })}`)
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
