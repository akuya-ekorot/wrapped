import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/customers/useOptimisticCustomers';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBackPath } from '@/components/shared/BackButton';

import { type Customer, insertCustomerParams } from '@/lib/db/schema/customers';
import {
  createCustomerAction,
  deleteCustomerAction,
  updateCustomerAction,
} from '@/lib/actions/customers';

const CustomerForm = ({
  customer,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  customer?: Customer | null;
  openModal?: (customerAddress?: Customer) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<
    Customer & { name: string | undefined; email: string }
  >(insertCustomerParams);
  const editing = !!customer?.id;

  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('customer-addresses');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Customer },
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
      toast.success(`Customer ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const customerParsed = await insertCustomerParams.safeParseAsync({
      ...payload,
    });
    if (!customerParsed.success) {
      setErrors(customerParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();

    const values = customerParsed.data;
    const pendingCustomer: Customer = {
      updatedAt: customer?.updatedAt ?? new Date(),
      createdAt: customer?.createdAt ?? new Date(),
      id: customer?.id ?? '',
      userId: customer?.userId ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingCustomer,
            action: editing ? 'update' : 'create',
          });

        const { data: _, error } = editing
          ? await updateCustomerAction({
              ...values,
              id: customer.id,
            })
          : await createCustomerAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingCustomer,
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

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <form
      action={handleSubmit}
      onChange={handleChange}
      className={'space-y-4 mt-4'}
    >
      {/* Schema fields start */}
      <div>
        <Input
          type="name"
          name="name"
          placeholder="Full name"
          className={cn(errors?.name ? 'ring ring-destructive' : '')}
          defaultValue={customer?.name ?? ''}
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
          defaultValue={customer?.email ?? ''}
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
            defaultValue={customer?.country ?? ''}
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
            defaultValue={customer?.city ?? ''}
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
          defaultValue={customer?.address ?? ''}
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
          defaultValue={customer?.extraDetails ?? ''}
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
            defaultValue={customer?.phone ?? ''}
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
            defaultValue={customer?.postalCode ?? ''}
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
      <SaveButton editing={editing} errors={hasErrors} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: 'delete', data: customer });
              const error = await deleteCustomerAction(customer.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: customer,
              };

              onSuccess('delete', error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? 'ing...' : 'e'}
        </Button>
      ) : null}
    </form>
  );
};

export default CustomerForm;

const SaveButton = ({
  editing,
  errors,
}: {
  errors: boolean;
  editing: Boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? 'ing...' : 'e'}`
        : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  );
};
