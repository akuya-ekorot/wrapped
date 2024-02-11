"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type OptionValue, CompleteOptionValue } from "@/lib/db/schema/optionValues";
import Modal from "@/components/shared/Modal";
import { type Option, type OptionId } from "@/lib/db/schema/options";
import { useOptimisticOptionValues } from "@/app/(app)/option-values/useOptimisticOptionValues";
import { Button } from "@/components/ui/button";
import OptionValueForm from "./OptionValueForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (optionValue?: OptionValue) => void;

export default function OptionValueList({
  optionValues,
  options,
  optionId 
}: {
  optionValues: CompleteOptionValue[];
  options: Option[];
  optionId?: OptionId 
}) {
  const { optimisticOptionValues, addOptimisticOptionValue } = useOptimisticOptionValues(
    optionValues,
    options 
  );
  const [open, setOpen] = useState(false);
  const [activeOptionValue, setActiveOptionValue] = useState<OptionValue | null>(null);
  const openModal = (optionValue?: OptionValue) => {
    setOpen(true);
    optionValue ? setActiveOptionValue(optionValue) : setActiveOptionValue(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeOptionValue ? "Edit OptionValue" : "Create Option Value"}
      >
        <OptionValueForm
          optionValue={activeOptionValue}
          addOptimistic={addOptimisticOptionValue}
          openModal={openModal}
          closeModal={closeModal}
          options={options}
        optionId={optionId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticOptionValues.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticOptionValues.map((optionValue) => (
            <OptionValue
              optionValue={optionValue}
              key={optionValue.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const OptionValue = ({
  optionValue,
  openModal,
}: {
  optionValue: CompleteOptionValue;
  openModal: TOpenModal;
}) => {
  const optimistic = optionValue.id === "optimistic";
  const deleting = optionValue.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("option-values")
    ? pathname
    : pathname + "/option-values/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{optionValue.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + optionValue.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No option values
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new option value.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Option Values </Button>
      </div>
    </div>
  );
};
