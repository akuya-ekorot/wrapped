'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/admin/pages/useOptimisticPages';
import { type Page } from '@/lib/db/schema/pages';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import PageForm from '@/components/pages/PageForm';
import PageInfoList from '@/components/pages/PageInfoList';

export default function OptimisticPage({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Page) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPage, setOptimisticPage] = useOptimistic(page);
  const updatePage: TAddOptimistic = (input) =>
    setOptimisticPage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PageForm
          page={optimisticPage}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPage.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <PageInfoList page={optimisticPage} />
    </div>
  );
}
