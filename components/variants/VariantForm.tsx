import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/variants/useOptimisticVariants';

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
  type Variant,
  insertVariantParams,
  VariantStatus,
} from '@/lib/db/schema/variants';
import {
  createVariantAction,
  deleteVariantAction,
  updateVariantAction,
} from '@/lib/actions/variants';
import { type Product, type ProductId } from '@/lib/db/schema/products';

const VariantForm = ({
  products,
  productId,
  variant,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  variant?: Variant | null;
  products: Product[];
  productId?: ProductId;
  openModal?: (variant?: Variant) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Variant>(insertVariantParams);
  const editing = !!variant?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('variants');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Variant },
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
      toast.success(`Variant ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const variantParsed = await insertVariantParams.safeParseAsync({
      productId,
      isComplete: variant?.isComplete ?? false,
      ...payload,
    });
    if (!variantParsed.success) {
      setErrors(variantParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = variantParsed.data;
    const pendingVariant: Variant = {
      updatedAt: variant?.updatedAt ?? new Date(),
      createdAt: variant?.createdAt ?? new Date(),
      id: variant?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingVariant,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateVariantAction({ ...values, id: variant.id })
          : await createVariantAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingVariant,
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

      {productId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.productId ? 'text-destructive' : '',
            )}
          >
            Product
          </Label>
          <Select defaultValue={variant?.productId} name="productId">
            <SelectTrigger
              className={cn(errors?.productId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.id}
                  {/* TODO: Replace with a field from the product model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.productId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.productId[0]}
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
            errors?.name ? 'text-destructive' : '',
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? 'ring ring-destructive' : '')}
          defaultValue={variant?.name ?? ''}
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
          defaultValue={variant?.description ?? ''}
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
            errors?.price ? 'text-destructive' : '',
          )}
        >
          Price
        </Label>
        <Input
          type="text"
          name="price"
          className={cn(errors?.price ? 'ring ring-destructive' : '')}
          defaultValue={variant?.price ?? ''}
        />
        {errors?.price ? (
          <p className="text-xs text-destructive mt-2">{errors.price[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.status ? 'text-destructive' : '',
          )}
        >
          Status
        </Label>
        <Select defaultValue={variant?.status} name="status">
          <SelectTrigger
            className={cn(errors?.status ? 'ring ring-destructive' : '')}
          >
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(VariantStatus).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                addOptimistic({ action: 'delete', data: variant });
              const error = await deleteVariantAction(variant.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: variant,
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

export default VariantForm;

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
