'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/tags/useOptimisticTags';
import { type Tag } from '@/lib/db/schema/tags';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import TagForm from '@/components/tags/TagForm';
import InfoListItem from '@/components/shared/InfoListItem';

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

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(optimisticTag)
          .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
          .map(([key, value]) => (
            <InfoListItem key={key} title={key} value={value} />
          ))}
      </div>
    </div>
  );
}
