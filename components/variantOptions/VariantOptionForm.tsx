import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/variant-options/useOptimisticVariantOptions';

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
  type VariantOption,
  insertVariantOptionParams,
} from '@/lib/db/schema/variantOptions';
import {
  createVariantOptionAction,
  deleteVariantOptionAction,
  updateVariantOptionAction,
} from '@/lib/actions/variantOptions';
import { type Option, type OptionId } from '@/lib/db/schema/options';
import {
  type OptionValue,
  type OptionValueId,
} from '@/lib/db/schema/optionValues';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';

const VariantOptionForm = ({
  options,
  optionId,
  optionValues,
  optionValueId,
  variants,
  variantId,
  variantOption,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  variantOption?: VariantOption | null;
  options: Option[];
  optionId?: OptionId;
  optionValues: OptionValue[];
  optionValueId?: OptionValueId;
  variants: Variant[];
  variantId?: VariantId;
  openModal?: (variantOption?: VariantOption) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<VariantOption>(insertVariantOptionParams);
  const editing = !!variantOption?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('variant-options');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: VariantOption },
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
      toast.success(`VariantOption ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const variantOptionParsed = await insertVariantOptionParams.safeParseAsync({
      optionId,
      optionValueId,
      variantId,
      ...payload,
    });
    if (!variantOptionParsed.success) {
      setErrors(variantOptionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = variantOptionParsed.data;
    const pendingVariantOption: VariantOption = {
      updatedAt: variantOption?.updatedAt ?? new Date(),
      createdAt: variantOption?.createdAt ?? new Date(),
      id: variantOption?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingVariantOption,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateVariantOptionAction({ ...values, id: variantOption.id })
          : await createVariantOptionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingVariantOption,
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
          <Select defaultValue={variantOption?.optionId} name="optionId">
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

      {optionValueId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.optionValueId ? 'text-destructive' : '',
            )}
          >
            OptionValue
          </Label>
          <Select
            defaultValue={variantOption?.optionValueId}
            name="optionValueId"
          >
            <SelectTrigger
              className={cn(
                errors?.optionValueId ? 'ring ring-destructive' : '',
              )}
            >
              <SelectValue placeholder="Select a optionValue" />
            </SelectTrigger>
            <SelectContent>
              {optionValues?.map((optionValue) => (
                <SelectItem
                  key={optionValue.id}
                  value={optionValue.id.toString()}
                >
                  {optionValue.id}
                  {/* TODO: Replace with a field from the optionValue model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.optionValueId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.optionValueId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {variantId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.variantId ? 'text-destructive' : '',
            )}
          >
            Variant
          </Label>
          <Select defaultValue={variantOption?.variantId} name="variantId">
            <SelectTrigger
              className={cn(errors?.variantId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a variant" />
            </SelectTrigger>
            <SelectContent>
              {variants?.map((variant) => (
                <SelectItem key={variant.id} value={variant.id.toString()}>
                  {variant.id}
                  {/* TODO: Replace with a field from the variant model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.variantId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.variantId[0]}
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
                addOptimistic({ action: 'delete', data: variantOption });
              const error = await deleteVariantOptionAction(variantOption.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: variantOption,
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

export default VariantOptionForm;

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
