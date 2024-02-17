import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getCustomerById } from '@/lib/api/customers/queries';
import OptimisticCustomer from './OptimisticCustomer';
import { checkAuth } from '@/lib/auth/utils';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function CustomerPage({
  params,
}: {
  params: { customerId: string };
}) {
  return (
    <main className="overflow-auto">
      <CustomerComponent id={params.customerId} />
    </main>
  );
}

const CustomerComponent = async ({ id }: { id: string }) => {
  await checkAuth();

  const { customer } = await getCustomerById(id);

  if (!customer) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="customer-addresses" />
        <OptimisticCustomer customer={customer} />
      </div>
    </Suspense>
  );
};
