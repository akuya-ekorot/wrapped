import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/customer-addresses/useOptimisticCustomerAddresses';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import {
  type CustomerAddress,
  insertCustomerAddressParams,
} from '@/lib/db/schema/customerAddresses';
import {
  createCustomerAddressAction,
  updateCustomerAddressAction,
} from '@/lib/actions/customerAddresses';

const CustomerAddressForm = ({
  customerAddress,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  customerAddress?: CustomerAddress | null;
  openModal?: (customerAddress?: CustomerAddress) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<
    CustomerAddress & { name: string | undefined; email: string }
  >(insertCustomerAddressParams);
  const editing = !!customerAddress?.id;

  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('customer-addresses');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CustomerAddress },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`CustomerAddress ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const customerAddressParsed =
      await insertCustomerAddressParams.safeParseAsync({
        ...payload,
      });
    if (!customerAddressParsed.success) {
      setErrors(customerAddressParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();

    const values = customerAddressParsed.data;
    const pendingCustomerAddress: CustomerAddress = {
      updatedAt: customerAddress?.updatedAt ?? new Date(),
      createdAt: customerAddress?.createdAt ?? new Date(),
      id: customerAddress?.id ?? '',
      userId: customerAddress?.userId ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingCustomerAddress,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateCustomerAddressAction({
              ...values,
              id: customerAddress.id,
            })
          : await createCustomerAddressAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingCustomerAddress,
        };
        onSuccess(
          editing ? 'update' : 'create',
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={'space-y-4'}>
      {/* Schema fields start */}
      <div>
        <Input
          type="name"
          name="name"
          placeholder="Full name"
          className={cn(errors?.name ? 'ring ring-destructive' : '')}
        />
        {errors?.name && (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        )}
      </div>
      <div>
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          className={cn(errors?.email ? 'ring ring-destructive' : '')}
        />
        {errors?.email && (
          <p className="text-xs text-destructive mt-2">{errors.email[0]}</p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <Input
            type="text"
            name="country"
            placeholder="Country"
            className={cn(errors?.country ? 'ring ring-destructive' : '')}
            defaultValue={customerAddress?.country ?? ''}
          />
          {errors?.country && (
            <p className="text-xs text-destructive mt-2">{errors.country[0]}</p>
          )}
        </div>
        <div className="w-full">
          <Input
            type="text"
            name="city"
            placeholder="City"
            className={cn(errors?.city ? 'ring ring-destructive' : '')}
            defaultValue={customerAddress?.city ?? ''}
          />
          {errors?.city && (
            <p className="text-xs text-destructive mt-2">{errors.city[0]}</p>
          )}
        </div>
      </div>
      <div>
        <Input
          type="text"
          name="address"
          placeholder="Address"
          className={cn(errors?.address ? 'ring ring-destructive' : '')}
          defaultValue={customerAddress?.address ?? ''}
        />
        {errors?.address && (
          <p className="text-xs text-destructive mt-2">{errors.address[0]}</p>
        )}
      </div>
      <div>
        <Input
          type="text"
          name="extraDetails"
          placeholder="Extra address details. eg Apt 3, 2nd floor, etc."
          className={cn(errors?.extraDetails ? 'ring ring-destructive' : '')}
          defaultValue={customerAddress?.extraDetails ?? ''}
        />
        {errors?.extraDetails && (
          <p className="text-xs text-destructive mt-2">
            {errors.extraDetails[0]}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <Input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className={cn(errors?.phone ? 'ring ring-destructive' : '')}
            defaultValue={customerAddress?.phone ?? ''}
          />
          {errors?.phone && (
            <p className="text-xs text-destructive mt-2">{errors.phone[0]}</p>
          )}
        </div>
        <div className="w-full">
          <Input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            className={cn(errors?.postalCode ? 'ring ring-destructive' : '')}
            defaultValue={customerAddress?.postalCode ?? ''}
          />
          {errors?.postalCode && (
            <p className="text-xs text-destructive mt-2">
              {errors.postalCode[0]}
            </p>
          )}
        </div>
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <div className="flex w-full justify-end">
        <SaveButton errors={hasErrors} />
      </div>
    </form>
  );
};

export default CustomerAddressForm;

const SaveButton = ({ errors }: { errors: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={errors}
      aria-disabled={errors}
    >
      {pending ? 'Checking...' : 'Proceed to shipping'}
    </Button>
  );
};
