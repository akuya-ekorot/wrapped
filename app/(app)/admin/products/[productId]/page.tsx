import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import {
  getProductByIdWithProductImagesAndOptionsAndProductTags,
  getProducts,
} from '@/lib/api/products/queries';
import { getCollections } from '@/lib/api/collections/queries';
import OptimisticProduct from '@/app/(app)/admin/products/[productId]/OptimisticProduct';
import ProductImageList from '@/components/productImages/ProductImageList';
import OptionList from '@/components/options/OptionList';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getImages } from '@/lib/api/images/queries';
import { getTags } from '@/lib/api/tags/queries';
import VariantList from '@/components/variants/VariantList';
import { getVariants } from '@/lib/api/variants/queries';
import ProductCollectionList from '@/components/productCollections/ProductCollectionList';
import { getProductCollectionsByProductId } from '@/lib/api/productCollections/queries';

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <main className="overflow-auto">
      <Product id={params.productId} />
    </main>
  );
}

const Product = async ({ id }: { id: string }) => {
  const { product, productImages, options } =
    await getProductByIdWithProductImagesAndOptionsAndProductTags(id);
  const { collections } = await getCollections();
  const { images } = await getImages();
  const { variants } = await getVariants();
  const { products } = await getProducts();
  const { productCollections } = await getProductCollectionsByProductId(id);

  if (!product) notFound();

  const productVariants = variants.filter((v) => v.productId === product.id);
  const productOptions = options.filter((o) => o.productId === product.id);

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="products" />
        <OptimisticProduct product={product} collections={collections} />
      </div>

      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {product.name}&apos;s Product Images
        </h3>
        <ProductImageList
          images={images}
          products={[]}
          productId={product.id}
          productImages={productImages}
        />
      </div>

      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {product.name}&apos;s Collections
        </h3>
        <ProductCollectionList
          products={products}
          collections={collections}
          productId={id}
          productCollections={productCollections}
        />
      </div>

      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {product.name}&apos;s Options
        </h3>
        <OptionList
          products={[]}
          productId={product.id}
          options={productOptions}
        />
      </div>

      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {product.name}&apos;s Product Variants
        </h3>
        <VariantList
          productId={product.id}
          variants={productVariants}
          products={[]}
        />
      </div>
    </Suspense>
  );
};
