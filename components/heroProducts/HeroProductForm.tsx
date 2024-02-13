import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/hero-products/useOptimisticHeroProducts';

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
  type HeroProduct,
  insertHeroProductParams,
} from '@/lib/db/schema/heroProducts';
import {
  createHeroProductAction,
  deleteHeroProductAction,
  updateHeroProductAction,
} from '@/lib/actions/heroProducts';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { type HeroLink, type HeroLinkId } from '@/lib/db/schema/heroLinks';

const HeroProductForm = ({
  products,
  productId,
  heroLinks,
  heroLinkId,
  heroProduct,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  heroProduct?: HeroProduct | null;
  products: Product[];
  productId?: ProductId;
  heroLinks: HeroLink[];
  heroLinkId?: HeroLinkId;
  openModal?: (heroProduct?: HeroProduct) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<HeroProduct>(insertHeroProductParams);
  const editing = !!heroProduct?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('hero-products');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: HeroProduct },
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
      toast.success(`HeroProduct ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const heroProductParsed = await insertHeroProductParams.safeParseAsync({
      productId,
      heroLinkId,
      ...payload,
    });
    if (!heroProductParsed.success) {
      setErrors(heroProductParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = heroProductParsed.data;
    const pendingHeroProduct: HeroProduct = {
      id: heroProduct?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingHeroProduct,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateHeroProductAction({ ...values, id: heroProduct.id })
          : await createHeroProductAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingHeroProduct,
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
          <Select defaultValue={heroProduct?.productId} name="productId">
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

      {heroLinkId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.heroLinkId ? 'text-destructive' : '',
            )}
          >
            HeroLink
          </Label>
          <Select defaultValue={heroProduct?.heroLinkId} name="heroLinkId">
            <SelectTrigger
              className={cn(errors?.heroLinkId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a heroLink" />
            </SelectTrigger>
            <SelectContent>
              {heroLinks?.map((heroLink) => (
                <SelectItem key={heroLink.id} value={heroLink.id.toString()}>
                  {heroLink.id}
                  {/* TODO: Replace with a field from the heroLink model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.heroLinkId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.heroLinkId[0]}
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
                addOptimistic({ action: 'delete', data: heroProduct });
              const error = await deleteHeroProductAction(heroProduct.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: heroProduct,
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

export default HeroProductForm;

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
