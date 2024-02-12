'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CompleteDeliveryZone } from '@/lib/db/schema/deliveryZones';
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
import Link from 'next/link';
import { ViewResourceLink } from '../shared/view-resource-link';

export const columns: ColumnDef<CompleteDeliveryZone>[] = [
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
    accessorKey: 'deliveryCost',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full flex items-center justify-end"
        >
          Delivery Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const cost = row.original.deliveryCost;

      const formattedCost = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
      }).format(cost);

      return <p className="text-right">{formattedCost}</p>;
    },
  },
  {
    id: 'actions',
    cell({ row }) {
      const deliveryZone = row.original;
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
              <ViewResourceLink
                id={deliveryZone.id}
                resourceName="delivery-zones"
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant={'destructive'}>
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete delivery zone</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
