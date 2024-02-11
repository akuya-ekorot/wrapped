'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { type Tag, CompleteTag } from '@/lib/db/schema/tags';
import Modal from '@/components/shared/Modal';

import { useOptimisticTags } from '@/app/(app)/tags/useOptimisticTags';
import { Button } from '@/components/ui/button';
import TagForm from './TagForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (tag?: Tag) => void;

export default function TagList({ tags }: { tags: CompleteTag[] }) {
  const { optimisticTags, addOptimisticTag } = useOptimisticTags(tags);
  const [open, setOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const openModal = (tag?: Tag) => {
    setOpen(true);
    tag ? setActiveTag(tag) : setActiveTag(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeTag ? 'Edit Tag' : 'Create Tag'}
      >
        <TagForm
          tag={activeTag}
          addOptimistic={addOptimisticTag}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticTags.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticTags.map((tag) => (
            <Tag tag={tag} key={tag.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Tag = ({
  tag,
  openModal,
}: {
  tag: CompleteTag;
  openModal: TOpenModal;
}) => {
  const optimistic = tag.id === 'optimistic';
  const deleting = tag.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('tags') ? pathname : pathname + '/tags/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{tag.name}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + tag.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No tags
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new tag.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Tags{' '}
        </Button>
      </div>
    </div>
  );
};
