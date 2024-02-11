import { Suspense } from "react";

import Loading from "@/app/loading";
import OptionValueList from "@/components/optionValues/OptionValueList";
import { getOptionValues } from "@/lib/api/optionValues/queries";
import { getOptions } from "@/lib/api/options/queries";

export const revalidate = 0;

export default async function OptionValuesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Option Values</h1>
        </div>
        <OptionValues />
      </div>
    </main>
  );
}

const OptionValues = async () => {
  
  const { optionValues } = await getOptionValues();
  const { options } = await getOptions();
  return (
    <Suspense fallback={<Loading />}>
      <OptionValueList optionValues={optionValues} options={options} />
    </Suspense>
  );
};
