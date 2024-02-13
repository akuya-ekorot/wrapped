import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/hero-sections/useOptimisticHeroSections';

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
  type HeroSection,
  insertHeroSectionParams,
} from '@/lib/db/schema/heroSections';
import {
  createHeroSectionAction,
  deleteHeroSectionAction,
  updateHeroSectionAction,
} from '@/lib/actions/heroSections';
import { type Image, type ImageId } from '@/lib/db/schema/images';
import { type HomePage, type HomePageId } from '@/lib/db/schema/homePages';

const HeroSectionForm = ({
  images,
  imageId,
  homePages,
  homePageId,
  heroSection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  heroSection?: HeroSection | null;
  images: Image[];
  imageId?: ImageId;
  homePages: HomePage[];
  homePageId?: HomePageId;
  openModal?: (heroSection?: HeroSection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<HeroSection>(insertHeroSectionParams);
  const editing = !!heroSection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('hero-sections');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: HeroSection },
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
      toast.success(`HeroSection ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const heroSectionParsed = await insertHeroSectionParams.safeParseAsync({
      imageId,
      homePageId,
      ...payload,
    });
    if (!heroSectionParsed.success) {
      setErrors(heroSectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = heroSectionParsed.data;
    const pendingHeroSection: HeroSection = {
      id: heroSection?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingHeroSection,
            action: editing ? 'update' : 'create',
          });

        const error = editing
          ? await updateHeroSectionAction({ ...values, id: heroSection.id })
          : await createHeroSectionAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingHeroSection,
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
          defaultValue={heroSection?.title ?? ''}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.callToAction ? 'text-destructive' : '',
          )}
        >
          Call To Action
        </Label>
        <Input
          type="text"
          name="callToAction"
          className={cn(errors?.callToAction ? 'ring ring-destructive' : '')}
          defaultValue={heroSection?.callToAction ?? ''}
        />
        {errors?.callToAction ? (
          <p className="text-xs text-destructive mt-2">
            {errors.callToAction[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {imageId ? null : (
        <div>
          <Label
            className={cn(
              'mb-2 inline-block',
              errors?.imageId ? 'text-destructive' : '',
            )}
          >
            Image
          </Label>
          <Select defaultValue={heroSection?.imageId} name="imageId">
            <SelectTrigger
              className={cn(errors?.imageId ? 'ring ring-destructive' : '')}
            >
              <SelectValue placeholder="Select a image" />
            </SelectTrigger>
            <SelectContent>
              {images?.map((image) => (
                <SelectItem key={image.id} value={image.id.toString()}>
                  {image.id}
                  {/* TODO: Replace with a field from the image model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.imageId ? (
            <p className="text-xs text-destructive mt-2">{errors.imageId[0]}</p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

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
          <Select defaultValue={heroSection?.homePageId} name="homePageId">
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
                addOptimistic({ action: 'delete', data: heroSection });
              const error = await deleteHeroSectionAction(heroSection.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: heroSection,
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

export default HeroSectionForm;

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
