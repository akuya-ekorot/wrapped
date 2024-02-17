import { type ProductImage } from '@/lib/db/schema/productImages';
import { type Variant } from '@/lib/db/schema/variants';
import {
  type VariantImage,
  type CompleteVariantImage,
} from '@/lib/db/schema/variantImages';
import { OptimisticAction } from '@/lib/utils';
import { useOptimistic } from 'react';
import { TImage } from '@/lib/db/schema/images';

export type TAddOptimistic = (action: OptimisticAction<VariantImage>) => void;

export const useOptimisticVariantImages = (
  variantImages: CompleteVariantImage[],
  images: TImage[],
  productImages: ProductImage[],
  variants: Variant[],
) => {
  const [optimisticVariantImages, addOptimisticVariantImage] = useOptimistic(
    variantImages,
    (
      currentState: CompleteVariantImage[],
      action: OptimisticAction<VariantImage>,
    ): CompleteVariantImage[] => {
      const { data } = action;

      const optimisticProductImage = productImages.find(
        (productImage) => productImage.id === data.productImageId,
      )!;

      const optimisticImage = images.find(
        (image) => image.id === optimisticProductImage.imageId,
      )!;

      const optimisticVariant = variants.find(
        (variant) => variant.id === data.variantId,
      )!;

      const optimisticVariantImage = {
        ...data,
        productImage: optimisticProductImage,
        variant: optimisticVariant,
        image: optimisticImage,
        id: 'optimistic',
      };

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticVariantImage]
            : [...currentState, optimisticVariantImage];
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticVariantImage } : item,
          );
        case 'delete':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: 'delete' } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticVariantImage, optimisticVariantImages };
};
