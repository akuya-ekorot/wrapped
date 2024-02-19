'use client';

import { CompleteOption } from '@/lib/db/schema/options';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ViewResourceLink } from '../shared/view-resource-link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

export const columns: ColumnDef<CompleteOption>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Option Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'values',
    accessorKey: 'optonValues',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full flex items-center justify-start"
        >
          Values
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const values = row.original.optionValues;

      return (
        <div className="flex gap-2 items-center">
          {values?.map((value) => <Badge key={value.id}>{value.name}</Badge>)}
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell({ row }) {
      const option = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <ViewResourceLink resourceName="options" id={option.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
