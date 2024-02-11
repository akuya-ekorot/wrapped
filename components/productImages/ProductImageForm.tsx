import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/product-images/useOptimisticProductImages';

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
  type ProductImage,
  insertProductImageParams,
} from '@/lib/db/schema/productImages';
import {
  createProductImageAction,
  deleteProductImageAction,
  updateProductImageAction,
} from '@/lib/actions/productImages';
import { type Image, type ImageId } from '@/lib/db/schema/images';
import { type Product, type ProductId } from '@/lib/db/schema/products';

const ProductImageForm = ({
  images,
  imageId,
  products,
  productId,
  productImage,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  productImage?: ProductImage | null;
  images: Image[];
  imageId?: ImageId;
  products: Product[];
  productId?: ProductId;
  openModal?: (productImage?: ProductImage) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ProductImage>(insertProductImageParams);
  const editing = !!productImage?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('product-images');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: ProductImage },
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
      toast.success(`ProductImage ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const productImageParsed = await insertProductImageParams.safeParseAsync({
      imageId,
      productId,
      ...payload,
    });
    if (!productImageParsed.success) {
      setErrors(productImageParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = productImageParsed.data;
    const pendingProductImage: ProductImage = {
      updatedAt: productImage?.updatedAt ?? new Date(),
      createdAt: productImage?.createdAt ?? new Date(),
      id: productImage?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingProductImage,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateProductImageAction({ ...values, id: productImage.id })
          : await createProductImageAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingProductImage,
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

      {imageId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.imageId ? 'text-destructive' : '',
            )}
          >
            Image
          </Label>
          <Select defaultValue={productImage?.imageId} name="imageId">
            <SelectTrigger
              className={cn(errors?.imageId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a image" />
            </SelectTrigger>
            <SelectContent>
              {images?.map((image) => (
                <SelectItem key={image.id} value={image.id.toString()}>
                  {image.id}
                  {/* TODO: Replace with a field from the image model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.imageId ? (
            <p className="text-xs text-destructive mt-2">{errors.imageId[0]}</p>
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
          <Select defaultValue={productImage?.productId} name="productId">
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
                addOptimistic({ action: 'delete', data: productImage });
              const error = await deleteProductImageAction(productImage.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: productImage,
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

export default ProductImageForm;

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
