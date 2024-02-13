import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/hero-collections/useOptimisticHeroCollections';

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
  type HeroCollection,
  insertHeroCollectionParams,
} from '@/lib/db/schema/heroCollections';
import {
  createHeroCollectionAction,
  deleteHeroCollectionAction,
  updateHeroCollectionAction,
} from '@/lib/actions/heroCollections';
import {
  type Collection,
  type CollectionId,
} from '@/lib/db/schema/collections';
import { type HeroLink, type HeroLinkId } from '@/lib/db/schema/heroLinks';

const HeroCollectionForm = ({
  collections,
  collectionId,
  heroLinks,
  heroLinkId,
  heroCollection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  heroCollection?: HeroCollection | null;
  collections: Collection[];
  collectionId?: CollectionId;
  heroLinks: HeroLink[];
  heroLinkId?: HeroLinkId;
  openModal?: (heroCollection?: HeroCollection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<HeroCollection>(insertHeroCollectionParams);
  const editing = !!heroCollection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('hero-collections');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: HeroCollection },
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
      toast.success(`HeroCollection ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const heroCollectionParsed =
      await insertHeroCollectionParams.safeParseAsync({
        collectionId,
        heroLinkId,
        ...payload,
      });
    if (!heroCollectionParsed.success) {
      setErrors(heroCollectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = heroCollectionParsed.data;
    const pendingHeroCollection: HeroCollection = {
      id: heroCollection?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingHeroCollection,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateHeroCollectionAction({
              ...values,
              id: heroCollection.id,
            })
          : await createHeroCollectionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingHeroCollection,
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
            defaultValue={heroCollection?.collectionId}
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

      {heroLinkId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.heroLinkId ? 'text-destructive' : '',
            )}
          >
            HeroLink
          </Label>
          <Select defaultValue={heroCollection?.heroLinkId} name="heroLinkId">
            <SelectTrigger
              className={cn(errors?.heroLinkId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a heroLink" />
            </SelectTrigger>
            <SelectContent>
              {heroLinks?.map((heroLink) => (
                <SelectItem key={heroLink.id} value={heroLink.id.toString()}>
                  {heroLink.id}
                  {/* TODO: Replace with a field from the heroLink model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.heroLinkId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.heroLinkId[0]}
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
                addOptimistic({ action: 'delete', data: heroCollection });
              const error = await deleteHeroCollectionAction(heroCollection.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: heroCollection,
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

export default HeroCollectionForm;

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
