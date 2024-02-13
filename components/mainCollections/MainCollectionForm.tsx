import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/main-collections/useOptimisticMainCollections';

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
  type MainCollection,
  insertMainCollectionParams,
} from '@/lib/db/schema/mainCollections';
import {
  createMainCollectionAction,
  deleteMainCollectionAction,
  updateMainCollectionAction,
} from '@/lib/actions/mainCollections';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';

const MainCollectionForm = ({
  homePages,
  homePageId,
  mainCollection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  mainCollection?: MainCollection | null;
  homePages: HomePage[];
  homePageId?: HomePageId;
  openModal?: (mainCollection?: MainCollection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<MainCollection>(insertMainCollectionParams);
  const editing = !!mainCollection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('main-collections');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: MainCollection },
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
      toast.success(`MainCollection ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const mainCollectionParsed =
      await insertMainCollectionParams.safeParseAsync({
        homePageId,
        ...payload,
      });
    if (!mainCollectionParsed.success) {
      setErrors(mainCollectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = mainCollectionParsed.data;
    const pendingMainCollection: MainCollection = {
      id: mainCollection?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingMainCollection,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateMainCollectionAction({
              ...values,
              id: mainCollection.id,
            })
          : await createMainCollectionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingMainCollection,
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
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.title ? 'text-destructive' : '',
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? 'ring ring-destructive' : '')}
          defaultValue={mainCollection?.title ?? ''}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {homePageId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.homePageId ? 'text-destructive' : '',
            )}
          >
            HomePage
          </Label>
          <Select defaultValue={mainCollection?.homePageId} name="homePageId">
            <SelectTrigger
              className={cn(errors?.homePageId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a homePage" />
            </SelectTrigger>
            <SelectContent>
              {homePages?.map((homePage) => (
                <SelectItem key={homePage.id} value={homePage.id.toString()}>
                  {homePage.id}
                  {/* TODO: Replace with a field from the homePage model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.homePageId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.homePageId[0]}
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
                addOptimistic({ action: 'delete', data: mainCollection });
              const error = await deleteMainCollectionAction(mainCollection.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: mainCollection,
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

export default MainCollectionForm;

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
