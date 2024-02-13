import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/referred-collections/useOptimisticReferredCollections';

import { Input } from '@/components/ui/input';
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
  type ReferredCollection,
  insertReferredCollectionParams,
} from '@/lib/db/schema/referredCollections';
import {
  createReferredCollectionAction,
  deleteReferredCollectionAction,
  updateReferredCollectionAction,
} from '@/lib/actions/referredCollections';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import {
  type MainCollection,
  type MainCollectionId,
} from '@/lib/db/schema/mainCollections';

const ReferredCollectionForm = ({
  collections,
  collectionId,
  mainCollections,
  mainCollectionId,
  referredCollection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  referredCollection?: ReferredCollection | null;
  collections: Collection[];
  collectionId?: CollectionId;
  mainCollections: MainCollection[];
  mainCollectionId?: MainCollectionId;
  openModal?: (referredCollection?: ReferredCollection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<ReferredCollection>(insertReferredCollectionParams);
  const editing = !!referredCollection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('referred-collections');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: ReferredCollection },
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
      toast.success(`ReferredCollection ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const referredCollectionParsed =
      await insertReferredCollectionParams.safeParseAsync({
        collectionId,
        mainCollectionId,
        ...payload,
      });
    if (!referredCollectionParsed.success) {
      setErrors(referredCollectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = referredCollectionParsed.data;
    const pendingReferredCollection: ReferredCollection = {
      id: referredCollection?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingReferredCollection,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateReferredCollectionAction({
              ...values,
              id: referredCollection.id,
            })
          : await createReferredCollectionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingReferredCollection,
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
            defaultValue={referredCollection?.collectionId}
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
                  {collection.id}
                  {/* TODO: Replace with a field from the collection model */}
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

      {mainCollectionId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.mainCollectionId ? 'text-destructive' : '',
            )}
          >
            MainCollection
          </Label>
          <Select
            defaultValue={referredCollection?.mainCollectionId}
            name="mainCollectionId"
          >
            <SelectTrigger
              className={cn(
                errors?.mainCollectionId ? 'ring ring-destructive' : '',
              )}
            >
              <SelectValue placeholder="Select a mainCollection" />
            </SelectTrigger>
            <SelectContent>
              {mainCollections?.map((mainCollection) => (
                <SelectItem
                  key={mainCollection.id}
                  value={mainCollection.id.toString()}
                >
                  {mainCollection.id}
                  {/* TODO: Replace with a field from the mainCollection model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.mainCollectionId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.mainCollectionId[0]}
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
                addOptimistic({ action: 'delete', data: referredCollection });
              const error = await deleteReferredCollectionAction(
                referredCollection.id,
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: referredCollection,
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

export default ReferredCollectionForm;

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
