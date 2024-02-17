import { Suspense } from "react";

import Loading from "@/app/loading";
import ProductCollectionList from "@/components/productCollections/ProductCollectionList";
import { getProductCollections } from "@/lib/api/productCollections/queries";
import { getCollections } from "@/lib/api/collections/queries";
import { getProducts } from "@/lib/api/products/queries";

export const revalidate = 0;

export default async function ProductCollectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Product Collections</h1>
        </div>
        <ProductCollections />
      </div>
    </main>
  );
}

const ProductCollections = async () => {
  
  const { productCollections } = await getProductCollections();
  const { collections } = await getCollections();
  const { products } = await getProducts();
  return (
    <Suspense fallback={<Loading />}>
      <ProductCollectionList productCollections={productCollections} collections={collections} products={products} />
    </Suspense>
  );
};
