import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/variant-images/useOptimisticVariantImages';

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
  type VariantImage,
  insertVariantImageParams,
} from '@/lib/db/schema/variantImages';
import {
  createVariantImageAction,
  deleteVariantImageAction,
  updateVariantImageAction,
} from '@/lib/actions/variantImages';
import {
  type ProductImage,
  type ProductImageId,
} from '@/lib/db/schema/productImages';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';

const VariantImageForm = ({
  productImages,
  productImageId,
  variants,
  variantId,
  variantImage,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  variantImage?: VariantImage | null;
  productImages: ProductImage[];
  productImageId?: ProductImageId;
  variants: Variant[];
  variantId?: VariantId;
  openModal?: (variantImage?: VariantImage) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<VariantImage>(insertVariantImageParams);
  const editing = !!variantImage?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('variant-images');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: VariantImage },
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
      toast.success(`VariantImage ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const variantImageParsed = await insertVariantImageParams.safeParseAsync({
      productImageId,
      variantId,
      ...payload,
    });
    if (!variantImageParsed.success) {
      setErrors(variantImageParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = variantImageParsed.data;
    const pendingVariantImage: VariantImage = {
      id: variantImage?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingVariantImage,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateVariantImageAction({ ...values, id: variantImage.id })
          : await createVariantImageAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingVariantImage,
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

      {productImageId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.productImageId ? 'text-destructive' : '',
            )}
          >
            ProductImage
          </Label>
          <Select
            defaultValue={variantImage?.productImageId}
            name="productImageId"
          >
            <SelectTrigger
              className={cn(
                errors?.productImageId ? 'ring ring-destructive' : '',
              )}
            >
              <SelectValue placeholder="Select a productImage" />
            </SelectTrigger>
            <SelectContent>
              {productImages?.map((productImage) => (
                <SelectItem
                  key={productImage.id}
                  value={productImage.id.toString()}
                >
                  {productImage.id}
                  {/* TODO: Replace with a field from the productImage model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.productImageId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.productImageId[0]}
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
          <Select defaultValue={variantImage?.variantId} name="variantId">
            <SelectTrigger
              className={cn(errors?.variantId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a variant" />
            </SelectTrigger>
            <SelectContent>
              {variants?.map((variant) => (
                <SelectItem key={variant.id} value={variant.id.toString()}>
                  {variant.name}
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
                addOptimistic({ action: 'delete', data: variantImage });
              const error = await deleteVariantImageAction(variantImage.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: variantImage,
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

export default VariantImageForm;

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
