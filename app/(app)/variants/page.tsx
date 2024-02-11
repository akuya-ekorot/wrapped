import { Suspense } from "react";

import Loading from "@/app/loading";
import VariantList from "@/components/variants/VariantList";
import { getVariants } from "@/lib/api/variants/queries";
import { getProducts } from "@/lib/api/products/queries";

export const revalidate = 0;

export default async function VariantsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Variants</h1>
        </div>
        <Variants />
      </div>
    </main>
  );
}

const Variants = async () => {
  
  const { variants } = await getVariants();
  const { products } = await getProducts();
  return (
    <Suspense fallback={<Loading />}>
      <VariantList variants={variants} products={products} />
    </Suspense>
  );
};
