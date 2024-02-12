import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/link-to-products/useOptimisticLinkToProducts';

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
  type LinkToProduct,
  insertLinkToProductParams,
} from '@/lib/db/schema/linkToProducts';
import {
  createLinkToProductAction,
  deleteLinkToProductAction,
  updateLinkToProductAction,
} from '@/lib/actions/linkToProducts';
import { type Product, type ProductId } from '@/lib/db/schema/products';
import { type PageLink, type PageLinkId } from '@/lib/db/schema/pageLinks';

const LinkToProductForm = ({
  products,
  productId,
  pageLinks,
  pageLinkId,
  linkToProduct,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  linkToProduct?: LinkToProduct | null;
  products: Product[];
  productId?: ProductId;
  pageLinks: PageLink[];
  pageLinkId?: PageLinkId;
  openModal?: (linkToProduct?: LinkToProduct) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<LinkToProduct>(insertLinkToProductParams);
  const editing = !!linkToProduct?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('link-to-products');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: LinkToProduct },
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
      toast.success(`LinkToProduct ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const linkToProductParsed = await insertLinkToProductParams.safeParseAsync({
      productId,
      pageLinkId,
      ...payload,
    });
    if (!linkToProductParsed.success) {
      setErrors(linkToProductParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = linkToProductParsed.data;
    const pendingLinkToProduct: LinkToProduct = {
      updatedAt: linkToProduct?.updatedAt ?? new Date(),
      createdAt: linkToProduct?.createdAt ?? new Date(),
      id: linkToProduct?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingLinkToProduct,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateLinkToProductAction({ ...values, id: linkToProduct.id })
          : await createLinkToProductAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingLinkToProduct,
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
          <Select defaultValue={linkToProduct?.productId} name="productId">
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

      {pageLinkId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.pageLinkId ? 'text-destructive' : '',
            )}
          >
            PageLink
          </Label>
          <Select defaultValue={linkToProduct?.pageLinkId} name="pageLinkId">
            <SelectTrigger
              className={cn(errors?.pageLinkId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a pageLink" />
            </SelectTrigger>
            <SelectContent>
              {pageLinks?.map((pageLink) => (
                <SelectItem key={pageLink.id} value={pageLink.id.toString()}>
                  {pageLink.id}
                  {/* TODO: Replace with a field from the pageLink model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.pageLinkId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.pageLinkId[0]}
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
                addOptimistic({ action: 'delete', data: linkToProduct });
              const error = await deleteLinkToProductAction(linkToProduct.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: linkToProduct,
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

export default LinkToProductForm;

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
