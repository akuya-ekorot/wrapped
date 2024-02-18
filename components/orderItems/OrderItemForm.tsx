import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/order-items/useOptimisticOrderItems';

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
  type OrderItem,
  insertOrderItemParams,
  CompleteOrderItem,
} from '@/lib/db/schema/orderItems';
import {
  createOrderItemAction,
  deleteOrderItemAction,
  updateOrderItemAction,
} from '@/lib/actions/orderItems';
import { type Variant, type VariantId } from '@/lib/db/schema/variants';
import { type Order, type OrderId } from '@/lib/db/schema/orders';
import { Product, ProductId } from '@/lib/db/schema/products';

const OrderItemForm = ({
  products,
  variants,
  variantId,
  productId,
  orders,
  orderId,
  orderItem,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  orderItem?: OrderItem | null;
  variants: Variant[];
  products: Product[];
  variantId?: VariantId;
  productId?: ProductId;
  orders: Order[];
  orderId?: OrderId;
  openModal?: (orderItem?: OrderItem) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<OrderItem>(insertOrderItemParams);
  const editing = !!orderItem?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('order-items');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: OrderItem },
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
      toast.success(`OrderItem ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const orderItemParsed = await insertOrderItemParams.safeParseAsync({
      orderId,
      ...payload,
      variantId:
        variantId ?? payload.variantId.toString().length === 0
          ? null
          : payload.variantId,
      productId:
        productId ?? payload.productId.toString().length === 0
          ? null
          : payload.productId,
    });

    if (!orderItemParsed.success) {
      setErrors(orderItemParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = orderItemParsed.data;
    const pendingOrderItem: OrderItem = {
      updatedAt: orderItem?.updatedAt ?? new Date(),
      createdAt: orderItem?.createdAt ?? new Date(),
      id: orderItem?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingOrderItem as CompleteOrderItem,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateOrderItemAction({ ...values, id: orderItem.id })
          : await createOrderItemAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingOrderItem,
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
            errors?.quantity ? 'text-destructive' : '',
          )}
        >
          Quantity
        </Label>
        <Input
          type="text"
          name="quantity"
          className={cn(errors?.quantity ? 'ring ring-destructive' : '')}
          defaultValue={orderItem?.quantity ?? ''}
        />
        {errors?.quantity ? (
          <p className="text-xs text-destructive mt-2">{errors.quantity[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.amount ? 'text-destructive' : '',
          )}
        >
          Amount
        </Label>
        <Input
          type="text"
          name="amount"
          className={cn(errors?.amount ? 'ring ring-destructive' : '')}
          defaultValue={orderItem?.amount ?? ''}
        />
        {errors?.amount ? (
          <p className="text-xs text-destructive mt-2">{errors.amount[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

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
          <Select
            defaultValue={orderItem?.variantId ?? undefined}
            name="variantId"
          >
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
          <Select
            defaultValue={orderItem?.productId ?? undefined}
            name="productId"
          >
            <SelectTrigger
              className={cn(errors?.productId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a variant" />
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

      {orderId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.orderId ? 'text-destructive' : '',
            )}
          >
            Order
          </Label>
          <Select defaultValue={orderItem?.orderId} name="orderId">
            <SelectTrigger
              className={cn(errors?.orderId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a order" />
            </SelectTrigger>
            <SelectContent>
              {orders?.map((order) => (
                <SelectItem key={order.id} value={order.id.toString()}>
                  {order.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.orderId ? (
            <p className="text-xs text-destructive mt-2">{errors.orderId[0]}</p>
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
                addOptimistic({
                  action: 'delete',
                  data: orderItem as CompleteOrderItem,
                });
              const error = await deleteOrderItemAction(orderItem.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: orderItem,
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

export default OrderItemForm;

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
