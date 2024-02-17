import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/link-to-collections/useOptimisticLinkToCollections';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  type LinkToCollection,
  insertLinkToCollectionParams,
  CompleteLinkToCollection,
} from '@/lib/db/schema/linkToCollections';
import {
  createLinkToCollectionAction,
  deleteLinkToCollectionAction,
  updateLinkToCollectionAction,
} from '@/lib/actions/linkToCollections';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type PageLink, type PageLinkId } from '@/lib/db/schema/pageLinks';

const LinkToCollectionForm = ({
  collections,
  collectionId,
  pageLinks,
  pageLinkId,
  linkToCollection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  linkToCollection?: CompleteLinkToCollection | null;
  collections: Collection[];
  collectionId?: CollectionId;
  pageLinks: PageLink[];
  pageLinkId?: PageLinkId;
  openModal?: (linkToCollection?: CompleteLinkToCollection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<LinkToCollection>(insertLinkToCollectionParams);
  const editing = !!linkToCollection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('link-to-collections');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CompleteLinkToCollection },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`LinkToCollection ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const linkToCollectionParsed =
      await insertLinkToCollectionParams.safeParseAsync({
        collectionId,
        pageLinkId,
        ...payload,
      });
    if (!linkToCollectionParsed.success) {
      setErrors(linkToCollectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = linkToCollectionParsed.data as Omit<
      CompleteLinkToCollection,
      'updatedAt' | 'createdAt' | 'id'
    >;
    const pendingLinkToCollection: CompleteLinkToCollection = {
      updatedAt: linkToCollection?.updatedAt ?? new Date(),
      createdAt: linkToCollection?.createdAt ?? new Date(),
      id: linkToCollection?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingLinkToCollection,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateLinkToCollectionAction({
              ...values,
              id: linkToCollection.id,
            })
          : await createLinkToCollectionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingLinkToCollection,
        };
        onSuccess(
          editing ? 'update' : 'create',
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={'space-y-8'}>
      {/* Schema fields start */}

      {collectionId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.collectionId ? 'text-destructive' : '',
            )}
          >
            Collection
          </Label>
          <Select
            defaultValue={linkToCollection?.collectionId}
            name="collectionId"
          >
            <SelectTrigger
              className={cn(
                errors?.collectionId ? 'ring ring-destructive' : '',
              )}
            >
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              {collections?.map((collection) => (
                <SelectItem
                  key={collection.id}
                  value={collection.id.toString()}
                >
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.collectionId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.collectionId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {pageLinkId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.pageLinkId ? 'text-destructive' : '',
            )}
          >
            PageLink
          </Label>
          <Select defaultValue={linkToCollection?.pageLinkId} name="pageLinkId">
            <SelectTrigger
              className={cn(errors?.pageLinkId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a pageLink" />
            </SelectTrigger>
            <SelectContent>
              {pageLinks?.map((pageLink) => (
                <SelectItem key={pageLink.id} value={pageLink.id.toString()}>
                  {pageLink.id}
                  {/* TODO: Replace with a field from the pageLink model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.pageLinkId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.pageLinkId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: 'delete', data: linkToCollection });
              const error = await deleteLinkToCollectionAction(
                linkToCollection.id,
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: linkToCollection,
              };

              onSuccess('delete', error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? 'ing...' : 'e'}
        </Button>
      ) : null}
    </form>
  );
};

export default LinkToCollectionForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? 'ing...' : 'e'}`
        : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  );
};
