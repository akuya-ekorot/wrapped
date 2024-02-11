import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/option-values/useOptimisticOptionValues';

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

import {
  type OptionValue,
  insertOptionValueParams,
} from '@/lib/db/schema/optionValues';
import {
  createOptionValueAction,
  deleteOptionValueAction,
  updateOptionValueAction,
} from '@/lib/actions/optionValues';
import { type Option, type OptionId } from '@/lib/db/schema/options';

const OptionValueForm = ({
  options,
  optionId,
  optionValue,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  optionValue?: OptionValue | null;
  options: Option[];
  optionId?: OptionId;
  openModal?: (optionValue?: OptionValue) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<OptionValue>(insertOptionValueParams);
  const editing = !!optionValue?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('option-values');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: OptionValue },
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
      toast.success(`OptionValue ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const optionValueParsed = await insertOptionValueParams.safeParseAsync({
      optionId,
      ...payload,
    });
    if (!optionValueParsed.success) {
      setErrors(optionValueParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = optionValueParsed.data;
    const pendingOptionValue: OptionValue = {
      updatedAt: optionValue?.updatedAt ?? new Date(),
      createdAt: optionValue?.createdAt ?? new Date(),
      id: optionValue?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingOptionValue,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateOptionValueAction({ ...values, id: optionValue.id })
          : await createOptionValueAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingOptionValue,
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
          defaultValue={optionValue?.name ?? ''}
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
          defaultValue={optionValue?.description ?? ''}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">
            {errors.description[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {optionId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.optionId ? 'text-destructive' : '',
            )}
          >
            Option
          </Label>
          <Select defaultValue={optionValue?.optionId} name="optionId">
            <SelectTrigger
              className={cn(errors?.optionId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a option" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.id}
                  {/* TODO: Replace with a field from the option model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.optionId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.optionId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
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
                addOptimistic({ action: 'delete', data: optionValue });
              const error = await deleteOptionValueAction(optionValue.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: optionValue,
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

export default OptionValueForm;

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
