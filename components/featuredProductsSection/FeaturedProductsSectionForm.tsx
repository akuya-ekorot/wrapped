import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/featured-products-section/useOptimisticFeaturedProductsSection';

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
  type FeaturedProductsSection,
  insertFeaturedProductsSectionParams,
} from '@/lib/db/schema/featuredProductsSection';
import {
  createFeaturedProductsSectionAction,
  deleteFeaturedProductsSectionAction,
  updateFeaturedProductsSectionAction,
} from '@/lib/actions/featuredProductsSection';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';

const FeaturedProductsSectionForm = ({
  homePages,
  homePageId,
  featuredProductsSection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  featuredProductsSection?: FeaturedProductsSection | null;
  homePages: HomePage[];
  homePageId?: HomePageId;
  openModal?: (featuredProductsSection?: FeaturedProductsSection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<FeaturedProductsSection>(
      insertFeaturedProductsSectionParams,
    );
  const editing = !!featuredProductsSection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('featured-products-section');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: FeaturedProductsSection },
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
      toast.success(`FeaturedProductsSection ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const featuredProductsSectionParsed =
      await insertFeaturedProductsSectionParams.safeParseAsync({
        homePageId,
        ...payload,
      });
    if (!featuredProductsSectionParsed.success) {
      setErrors(featuredProductsSectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = featuredProductsSectionParsed.data;
    const pendingFeaturedProductsSection: FeaturedProductsSection = {
      id: featuredProductsSection?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingFeaturedProductsSection,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateFeaturedProductsSectionAction({
              ...values,
              id: featuredProductsSection.id,
            })
          : await createFeaturedProductsSectionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingFeaturedProductsSection,
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
          defaultValue={featuredProductsSection?.title ?? ''}
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
          <Select
            defaultValue={featuredProductsSection?.homePageId}
            name="homePageId"
          >
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
                addOptimistic({
                  action: 'delete',
                  data: featuredProductsSection,
                });
              const error = await deleteFeaturedProductsSectionAction(
                featuredProductsSection.id,
              );
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: featuredProductsSection,
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

export default FeaturedProductsSectionForm;

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
