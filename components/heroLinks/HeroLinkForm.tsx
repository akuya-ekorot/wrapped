import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/hero-links/useOptimisticHeroLinks';

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

import { type HeroLink, insertHeroLinkParams } from '@/lib/db/schema/heroLinks';
import {
  createHeroLinkAction,
  deleteHeroLinkAction,
  updateHeroLinkAction,
} from '@/lib/actions/heroLinks';
import {
  type HeroSection,
  type HeroSectionId,
} from '@/lib/db/schema/heroSections';

const HeroLinkForm = ({
  heroSections,
  heroSectionId,
  heroLink,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  heroLink?: HeroLink | null;
  heroSections: HeroSection[];
  heroSectionId?: HeroSectionId;
  openModal?: (heroLink?: HeroLink) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<HeroLink>(insertHeroLinkParams);
  const editing = !!heroLink?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('hero-links');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: HeroLink },
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
      toast.success(`HeroLink ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const heroLinkParsed = await insertHeroLinkParams.safeParseAsync({
      heroSectionId,
      ...payload,
    });
    if (!heroLinkParsed.success) {
      setErrors(heroLinkParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = heroLinkParsed.data;
    const pendingHeroLink: HeroLink = {
      id: heroLink?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingHeroLink,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateHeroLinkAction({ ...values, id: heroLink.id })
          : await createHeroLinkAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingHeroLink,
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
            errors?.type ? 'text-destructive' : '',
          )}
        >
          Type
        </Label>
        <Input
          type="text"
          name="type"
          className={cn(errors?.type ? 'ring ring-destructive' : '')}
          defaultValue={heroLink?.type ?? ''}
        />
        {errors?.type ? (
          <p className="text-xs text-destructive mt-2">{errors.type[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {heroSectionId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.heroSectionId ? 'text-destructive' : '',
            )}
          >
            HeroSection
          </Label>
          <Select defaultValue={heroLink?.heroSectionId} name="heroSectionId">
            <SelectTrigger
              className={cn(
                errors?.heroSectionId ? 'ring ring-destructive' : '',
              )}
            >
              <SelectValue placeholder="Select a heroSection" />
            </SelectTrigger>
            <SelectContent>
              {heroSections?.map((heroSection) => (
                <SelectItem
                  key={heroSection.id}
                  value={heroSection.id.toString()}
                >
                  {heroSection.id}
                  {/* TODO: Replace with a field from the heroSection model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.heroSectionId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.heroSectionId[0]}
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
                addOptimistic({ action: 'delete', data: heroLink });
              const error = await deleteHeroLinkAction(heroLink.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: heroLink,
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

export default HeroLinkForm;

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
