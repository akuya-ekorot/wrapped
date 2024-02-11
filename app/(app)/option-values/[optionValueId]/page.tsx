import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getOptionValueById } from "@/lib/api/optionValues/queries";
import { getOptions } from "@/lib/api/options/queries";import OptimisticOptionValue from "@/app/(app)/option-values/[optionValueId]/OptimisticOptionValue";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function OptionValuePage({
  params,
}: {
  params: { optionValueId: string };
}) {

  return (
    <main className="overflow-auto">
      <OptionValue id={params.optionValueId} />
    </main>
  );
}

const OptionValue = async ({ id }: { id: string }) => {
  
  const { optionValue } = await getOptionValueById(id);
  const { options } = await getOptions();

  if (!optionValue) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="option-values" />
        <OptimisticOptionValue optionValue={optionValue} options={options} />
      </div>
    </Suspense>
  );
};
