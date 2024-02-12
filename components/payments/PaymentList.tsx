'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type Payment, CompletePayment } from '@/lib/db/schema/payments';
import Modal from '@/components/shared/Modal';

import { useOptimisticPayments } from '@/app/(app)/admin/payments/useOptimisticPayments';
import { Button } from '@/components/ui/button';
import PaymentForm from './PaymentForm';
import { PlusIcon } from 'lucide-react';
import { DataTable } from '../shared/data-table';
import { columns } from './columns';

type TOpenModal = (payment?: Payment) => void;

export default function PaymentList({
  payments,
}: {
  payments: CompletePayment[];
}) {
  const { optimisticPayments, addOptimisticPayment } =
    useOptimisticPayments(payments);
  const [open, setOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const openModal = (payment?: Payment) => {
    setOpen(true);
    payment ? setActivePayment(payment) : setActivePayment(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePayment ? 'Edit Payment' : 'Create Payment'}
      >
        <PaymentForm
          payment={activePayment}
          addOptimistic={addOptimisticPayment}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticPayments.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <DataTable
          resourceName="payments"
          columns={columns}
          data={optimisticPayments}
        />
      )}
    </div>
  );
}

const Payment = ({
  payment,
  openModal,
}: {
  payment: CompletePayment;
  openModal: TOpenModal;
}) => {
  const optimistic = payment.id === 'optimistic';
  const deleting = payment.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('payments')
    ? pathname
    : pathname + '/payments/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{payment.reference}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + payment.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No payments
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new payment.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Payments{' '}
        </Button>
      </div>
    </div>
  );
};
