'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CompleteVariant } from '@/lib/db/schema/variants';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ViewResourceLink } from '../shared/view-resource-link';

export const columns: ColumnDef<CompleteVariant>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const status = row.original.status;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full flex items-center justify-end"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const price = row.original.price;

      const formattedCost = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
      }).format(price ?? 0);

      return <p className="text-right">{formattedCost}</p>;
    },
  },
  {
    id: 'actions',
    cell({ row }) {
      const variant = row.original;
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
              <ViewResourceLink resourceName="variants" id={variant.id} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant={'destructive'}>
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete product</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
