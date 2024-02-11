'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/tags/useOptimisticTags';
import { type Tag } from '@/lib/db/schema/tags';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import TagForm from '@/components/tags/TagForm';

export default function OptimisticTag({ tag }: { tag: Tag }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Tag) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticTag, setOptimisticTag] = useOptimistic(tag);
  const updateTag: TAddOptimistic = (input) =>
    setOptimisticTag({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <TagForm
          tag={tag}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateTag}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{tag.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticTag.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticTag, null, 2)}
      </pre>
    </div>
  );
}
