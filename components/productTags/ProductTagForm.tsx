import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/product-tags/useOptimisticProductTags';

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
  type ProductTag,
  insertProductTagParams,
} from '@/lib/db/schema/productTags';
import {
  createProductTagAction,
  deleteProductTagAction,
  updateProductTagAction,
} from '@/lib/actions/productTags';
import { type Tag, type TagId } from '@/lib/db/schema/tags';
import { type Product, type ProductId } from '@/lib/db/schema/products';

const ProductTagForm = ({
  tags,
  tagId,
  products,
  productId,
  productTag,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  productTag?: ProductTag | null;
  tags: Tag[];
  tagId?: TagId;
  products: Product[];
  productId?: ProductId;
  openModal?: (productTag?: ProductTag) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ProductTag>(insertProductTagParams);
  const editing = !!productTag?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('product-tags');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: ProductTag },
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
      toast.success(`ProductTag ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const productTagParsed = await insertProductTagParams.safeParseAsync({
      tagId,
      productId,
      ...payload,
    });
    if (!productTagParsed.success) {
      setErrors(productTagParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = productTagParsed.data;
    const pendingProductTag: ProductTag = {
      updatedAt: productTag?.updatedAt ?? new Date(),
      createdAt: productTag?.createdAt ?? new Date(),
      id: productTag?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingProductTag,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateProductTagAction({ ...values, id: productTag.id })
          : await createProductTagAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingProductTag,
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

      {tagId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.tagId ? 'text-destructive' : '',
            )}
          >
            Tag
          </Label>
          <Select defaultValue={productTag?.tagId} name="tagId">
            <SelectTrigger
              className={cn(errors?.tagId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a tag" />
            </SelectTrigger>
            <SelectContent>
              {tags?.map((tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  {tag.id}
                  {/* TODO: Replace with a field from the tag model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.tagId ? (
            <p className="text-xs text-destructive mt-2">{errors.tagId[0]}</p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

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
          <Select defaultValue={productTag?.productId} name="productId">
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
                addOptimistic({ action: 'delete', data: productTag });
              const error = await deleteProductTagAction(productTag.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: productTag,
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

export default ProductTagForm;

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
