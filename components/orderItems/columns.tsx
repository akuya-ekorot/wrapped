'use client';

import { CompleteOrderItem } from '@/lib/db/schema/orderItems';
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

export const columns: ColumnDef<CompleteOrderItem>[] = [
  {
    id: 'productName',
    accessorFn: (row) =>
      row.variantId ? row.variant?.name : row.product?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const productName =
        row.original.product?.name ?? row.original.variant?.name;

      return <p className="">{productName ?? 'Error getting product name'}</p>;
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full flex items-center justify-end"
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      const quantity = row.original.quantity;

      return <p className="text-right">{quantity}</p>;
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
      const amount = row.original.amount;

      const formattedCost = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
      }).format(amount ?? 0);

      return <p className="text-right">{formattedCost}</p>;
    },
  },
  {
    id: 'actions',
    cell({ row }) {
      const orderItem = row.original;

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
              <ViewResourceLink id={orderItem.id} resourceName="order-items" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
