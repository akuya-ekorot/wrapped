import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getPaymentById } from '@/lib/api/payments/queries';
import OptimisticPayment from './OptimisticPayment';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function PaymentPage({
  params,
}: {
  params: { paymentId: string };
}) {
  return (
    <main className="overflow-auto">
      <Payment id={params.paymentId} />
    </main>
  );
}

const Payment = async ({ id }: { id: string }) => {
  const { payment } = await getPaymentById(id);

  if (!payment) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="payments" />
        <OptimisticPayment payment={payment} />
      </div>
    </Suspense>
  );
};
