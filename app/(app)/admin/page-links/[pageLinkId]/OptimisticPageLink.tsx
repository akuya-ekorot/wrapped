'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/page-links/useOptimisticPageLinks';
import { type PageLink } from '@/lib/db/schema/pageLinks';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import PageLinkForm from '@/components/pageLinks/PageLinkForm';
import InfoListItem from '@/components/shared/InfoListItem';

export default function OptimisticPageLink({
  pageLink,
}: {
  pageLink: PageLink;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: PageLink) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPageLink, setOptimisticPageLink] = useOptimistic(pageLink);
  const updatePageLink: TAddOptimistic = (input) =>
    setOptimisticPageLink({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PageLinkForm
          pageLink={pageLink}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePageLink}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{pageLink.type}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(optimisticPageLink)
          .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
          .map(([key, value]) => (
            <InfoListItem key={key} title={key} value={value} />
          ))}
      </div>
    </div>
  );
}
