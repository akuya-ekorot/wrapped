import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/orders/useOptimisticOrders';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { type Order, insertOrderParams } from '@/lib/db/schema/orders';
import {
  createOrderAction,
  deleteOrderAction,
  updateOrderAction,
} from '@/lib/actions/orders';
import {
  type DeliveryZone,
  type DeliveryZoneId,
} from '@/lib/db/schema/deliveryZones';

const OrderForm = ({
  deliveryZones,
  deliveryZoneId,
  order,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  order?: Order | null;
  deliveryZones: DeliveryZone[];
  deliveryZoneId?: DeliveryZoneId;
  openModal?: (order?: Order) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Order>(insertOrderParams);
  const editing = !!order?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('orders');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Order },
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
      toast.success(`Order ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const orderParsed = await insertOrderParams.safeParseAsync({
      deliveryZoneId,
      ...payload,
    });
    if (!orderParsed.success) {
      setErrors(orderParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = orderParsed.data;
    const pendingOrder: Order = {
      updatedAt: order?.updatedAt ?? new Date(),
      createdAt: order?.createdAt ?? new Date(),
      id: order?.id ?? '',
      userId: order?.userId ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingOrder,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateOrderAction({ ...values, id: order.id })
          : await createOrderAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingOrder,
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
    <form action={handleSubmit} onChange={handleChange} className={'space-y-8'}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.status ? 'text-destructive' : '',
          )}
        >
          Status
        </Label>
        <Input
          type="text"
          name="status"
          className={cn(errors?.status ? 'ring ring-destructive' : '')}
          defaultValue={order?.status ?? ''}
        />
        {errors?.status ? (
          <p className="text-xs text-destructive mt-2">{errors.status[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.type ? 'text-destructive' : '',
          )}
        >
          Type
        </Label>
        <Input
          type="text"
          name="type"
          className={cn(errors?.type ? 'ring ring-destructive' : '')}
          defaultValue={order?.type ?? ''}
        />
        {errors?.type ? (
          <p className="text-xs text-destructive mt-2">{errors.type[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {deliveryZoneId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.deliveryZoneId ? 'text-destructive' : '',
            )}
          >
            DeliveryZone
          </Label>
          <Select defaultValue={order?.deliveryZoneId} name="deliveryZoneId">
            <SelectTrigger
              className={cn(
                errors?.deliveryZoneId ? 'ring ring-destructive' : '',
              )}
            >
              <SelectValue placeholder="Select a deliveryZone" />
            </SelectTrigger>
            <SelectContent>
              {deliveryZones?.map((deliveryZone) => (
                <SelectItem
                  key={deliveryZone.id}
                  value={deliveryZone.id.toString()}
                >
                  {deliveryZone.id}
                  {/* TODO: Replace with a field from the deliveryZone model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.deliveryZoneId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.deliveryZoneId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.notes ? 'text-destructive' : '',
          )}
        >
          Notes
        </Label>
        <Input
          type="text"
          name="notes"
          className={cn(errors?.notes ? 'ring ring-destructive' : '')}
          defaultValue={order?.notes ?? ''}
        />
        {errors?.notes ? (
          <p className="text-xs text-destructive mt-2">{errors.notes[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.amount ? 'text-destructive' : '',
          )}
        >
          Amount
        </Label>
        <Input
          type="text"
          name="amount"
          className={cn(errors?.amount ? 'ring ring-destructive' : '')}
          defaultValue={order?.amount ?? ''}
        />
        {errors?.amount ? (
          <p className="text-xs text-destructive mt-2">{errors.amount[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

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
              addOptimistic && addOptimistic({ action: 'delete', data: order });
              const error = await deleteOrderAction(order.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: order,
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

export default OrderForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
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
