import { type Image } from "@/lib/db/schema/images";
import { type Product } from "@/lib/db/schema/products";
import { type ProductImage, type CompleteProductImage } from "@/lib/db/schema/productImages";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<ProductImage>) => void;

export const useOptimisticProductImages = (
  productImages: CompleteProductImage[],
  images: Image[],
  products: Product[]
) => {
  const [optimisticProductImages, addOptimisticProductImage] = useOptimistic(
    productImages,
    (
      currentState: CompleteProductImage[],
      action: OptimisticAction<ProductImage>,
    ): CompleteProductImage[] => {
      const { data } = action;

      const optimisticImage = images.find(
        (image) => image.id === data.imageId,
      )!;

      const optimisticProduct = products.find(
        (product) => product.id === data.productId,
      )!;

      const optimisticProductImage = {
        ...data,
        image: optimisticImage,
       product: optimisticProduct,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticProductImage]
            : [...currentState, optimisticProductImage];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticProductImage } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticProductImage, optimisticProductImages };
};
