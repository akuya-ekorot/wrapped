import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/delivery-zones/useOptimisticDeliveryZones';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import {
  type DeliveryZone,
  insertDeliveryZoneParams,
} from '@/lib/db/schema/deliveryZones';
import {
  createDeliveryZoneAction,
  deleteDeliveryZoneAction,
  updateDeliveryZoneAction,
} from '@/lib/actions/deliveryZones';

const DeliveryZoneForm = ({
  deliveryZone,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  deliveryZone?: DeliveryZone | null;

  openModal?: (deliveryZone?: DeliveryZone) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<DeliveryZone>(insertDeliveryZoneParams);
  const editing = !!deliveryZone?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('delivery-zones');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: DeliveryZone },
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
      toast.success(`DeliveryZone ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const deliveryZoneParsed = await insertDeliveryZoneParams.safeParseAsync({
      ...payload,
    });
    if (!deliveryZoneParsed.success) {
      setErrors(deliveryZoneParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = deliveryZoneParsed.data;
    const pendingDeliveryZone: DeliveryZone = {
      updatedAt: deliveryZone?.updatedAt ?? new Date(),
      createdAt: deliveryZone?.createdAt ?? new Date(),
      id: deliveryZone?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingDeliveryZone,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateDeliveryZoneAction({ ...values, id: deliveryZone.id })
          : await createDeliveryZoneAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingDeliveryZone,
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
            errors?.name ? 'text-destructive' : '',
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? 'ring ring-destructive' : '')}
          defaultValue={deliveryZone?.name ?? ''}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.description ? 'text-destructive' : '',
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? 'ring ring-destructive' : '')}
          defaultValue={deliveryZone?.description ?? ''}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">
            {errors.description[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.deliveryCost ? 'text-destructive' : '',
          )}
        >
          Delivery Cost
        </Label>
        <Input
          type="text"
          name="deliveryCost"
          className={cn(errors?.deliveryCost ? 'ring ring-destructive' : '')}
          defaultValue={deliveryZone?.deliveryCost ?? ''}
        />
        {errors?.deliveryCost ? (
          <p className="text-xs text-destructive mt-2">
            {errors.deliveryCost[0]}
          </p>
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
              addOptimistic &&
                addOptimistic({ action: 'delete', data: deliveryZone });
              const error = await deleteDeliveryZoneAction(deliveryZone.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: deliveryZone,
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

export default DeliveryZoneForm;

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
