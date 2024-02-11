"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type OrderItem, CompleteOrderItem } from "@/lib/db/schema/orderItems";
import Modal from "@/components/shared/Modal";
import { type Variant, type VariantId } from "@/lib/db/schema/variants";
import { type Order, type OrderId } from "@/lib/db/schema/orders";
import { useOptimisticOrderItems } from "@/app/(app)/order-items/useOptimisticOrderItems";
import { Button } from "@/components/ui/button";
import OrderItemForm from "./OrderItemForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (orderItem?: OrderItem) => void;

export default function OrderItemList({
  orderItems,
  variants,
  variantId,
  orders,
  orderId 
}: {
  orderItems: CompleteOrderItem[];
  variants: Variant[];
  variantId?: VariantId;
  orders: Order[];
  orderId?: OrderId 
}) {
  const { optimisticOrderItems, addOptimisticOrderItem } = useOptimisticOrderItems(
    orderItems,
    variants,
  orders 
  );
  const [open, setOpen] = useState(false);
  const [activeOrderItem, setActiveOrderItem] = useState<OrderItem | null>(null);
  const openModal = (orderItem?: OrderItem) => {
    setOpen(true);
    orderItem ? setActiveOrderItem(orderItem) : setActiveOrderItem(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeOrderItem ? "Edit OrderItem" : "Create Order Item"}
      >
        <OrderItemForm
          orderItem={activeOrderItem}
          addOptimistic={addOptimisticOrderItem}
          openModal={openModal}
          closeModal={closeModal}
          variants={variants}
        variantId={variantId}
        orders={orders}
        orderId={orderId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticOrderItems.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticOrderItems.map((orderItem) => (
            <OrderItem
              orderItem={orderItem}
              key={orderItem.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const OrderItem = ({
  orderItem,
  openModal,
}: {
  orderItem: CompleteOrderItem;
  openModal: TOpenModal;
}) => {
  const optimistic = orderItem.id === "optimistic";
  const deleting = orderItem.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("order-items")
    ? pathname
    : pathname + "/order-items/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{orderItem.quantity}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + orderItem.id }>
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
        No order items
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new order item.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Order Items </Button>
      </div>
    </div>
  );
};
