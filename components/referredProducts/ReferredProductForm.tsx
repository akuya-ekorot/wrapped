import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/referred-products/useOptimisticReferredProducts';

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
  type ReferredProduct,
  insertReferredProductParams,
} from '@/lib/db/schema/referredProducts';
import {
  createReferredProductAction,
  deleteReferredProductAction,
  updateReferredProductAction,
} from '@/lib/actions/referredProducts';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import {
  type FeaturedProductsSection,
  type FeaturedProductsSectionId,
} from '@/lib/db/schema/featuredProductsSection';

const ReferredProductForm = ({
  products,
  productId,
  featuredProductsSection,
  featuredProductsSectionId,
  referredProduct,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  referredProduct?: ReferredProduct | null;
  products: Product[];
  productId?: ProductId;
  featuredProductsSection: FeaturedProductsSection[];
  featuredProductsSectionId?: FeaturedProductsSectionId;
  openModal?: (referredProduct?: ReferredProduct) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ReferredProduct>(insertReferredProductParams);
  const editing = !!referredProduct?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('referred-products');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: ReferredProduct },
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
      toast.success(`ReferredProduct ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const referredProductParsed =
      await insertReferredProductParams.safeParseAsync({
        productId,
        featuredProductsSectionId,
        ...payload,
      });
    if (!referredProductParsed.success) {
      setErrors(referredProductParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = referredProductParsed.data;
    const pendingReferredProduct: ReferredProduct = {
      id: referredProduct?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingReferredProduct,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateReferredProductAction({
              ...values,
              id: referredProduct.id,
            })
          : await createReferredProductAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingReferredProduct,
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
          <Select defaultValue={referredProduct?.productId} name="productId">
            <SelectTrigger
              className={cn(errors?.productId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
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

      {featuredProductsSectionId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.featuredProductsSectionId ? 'text-destructive' : '',
            )}
          >
            FeaturedProductsSection
          </Label>
          <Select
            defaultValue={referredProduct?.featuredProductsSectionId}
            name="featuredProductsSectionId"
          >
            <SelectTrigger
              className={cn(
                errors?.featuredProductsSectionId
                  ? 'ring ring-destructive'
                  : '',
              )}
            >
              <SelectValue placeholder="Select a featuredProductsSection" />
            </SelectTrigger>
            <SelectContent>
              {featuredProductsSection?.map((featuredProductsSection) => (
                <SelectItem
                  key={featuredProductsSection.id}
                  value={featuredProductsSection.id.toString()}
                >
                  {featuredProductsSection.id}
                  {/* TODO: Replace with a field from the featuredProductsSection model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.featuredProductsSectionId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.featuredProductsSectionId[0]}
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
                addOptimistic({ action: 'delete', data: referredProduct });
              const error = await deleteReferredProductAction(
                referredProduct.id,
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: referredProduct,
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

export default ReferredProductForm;

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
