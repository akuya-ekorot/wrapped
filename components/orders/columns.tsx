'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CompleteOrder } from '@/lib/db/schema/orders';
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

export const columns: ColumnDef<CompleteOrder>[] = [
  {
    accessorKey: 'user.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'user.email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full flex items-center justify-end"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const cost = row.original.amount;

      const formattedCost = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
      }).format(cost);

      return <p className="text-right">{formattedCost}</p>;
    },
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

      return <Badge variant={'default'}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'deliveryZone.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className=""
        >
          Delivery Zone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const deliveryzone = row.original.deliveryZone?.name;

      return <Badge variant={'default'}>{deliveryzone}</Badge>;
    },
  },
  {
    id: 'actions',
    cell({ row }) {
      const order = row.original;
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
              <ViewResourceLink resourceName="orders" id={order.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];