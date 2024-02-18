'use client';

import { useState } from 'react';

import { type Customer, CompleteCustomer } from '@/lib/db/schema/customers';
import Modal from '@/components/shared/Modal';
import { useOptimisticCustomers } from '@/app/(app)/admin/customers/useOptimisticCustomers';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import CustomerForm from './CustomerForm';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';

type TOpenModal = (customer?: Customer) => void;

export default function CustomerList({
  customers,
}: {
  customers: CompleteCustomer[];
}) {
  const { optimisticCustomers, addOptimisticCustomer } =
    useOptimisticCustomers(customers);
  const [open, setOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const openModal = (customer?: Customer) => {
    setOpen(true);
    customer ? setActiveCustomer(customer) : setActiveCustomer(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCustomer ? 'Edit Customer' : 'Create Customer'}
      >
        <CustomerForm
          customer={activeCustomer}
          addOptimistic={addOptimisticCustomer}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticCustomers.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          searchColumn="name"
          resourceName="customers"
          columns={columns}
          data={optimisticCustomers}
        />
      )}
    </div>
  );
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No customers
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new customer.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Customers{' '}
        </Button>
      </div>
    </div>
  );
};
