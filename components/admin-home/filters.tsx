'use client';

import { Button } from '../ui/button';

export default function Filters() {
  return (
    <div>
      <div className="flex items-center divide-x border p-2">
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

          <Button size={'sm'} variant={'outline'}>
            Custom
          </Button>
        </div>
      </div>
    </div>
  );
}
