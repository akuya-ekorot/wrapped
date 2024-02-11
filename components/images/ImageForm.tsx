import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn, uploadImageAction } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/admin/images/useOptimisticImages';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import { type Image, insertImageParams } from '@/lib/db/schema/images';
import {
  createImageAction,
  deleteImageAction,
  updateImageAction,
} from '@/lib/actions/images';

const ImageForm = ({
  image,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
  setActiveImage,
}: {
  image?: Image | null;
  openModal?: (image?: Image) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
  setActiveImage?: (image: Image) => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Image>(insertImageParams);
  const editing = !!image?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('images');

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Image },
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
      toast.success(`Image ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (
    { images }: { images: FileList | null },
    data: FormData,
  ) => {
    setErrors(null);
    let url: string;

    try {
      if (images) {
        url = await uploadImageAction(images[0]);
      } else {
        throw new Error('No image provided');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to upload image');
      return;
    }

    const imageParsed = await insertImageParams.safeParseAsync({ url });
    if (!imageParsed.success) {
      setErrors(imageParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = imageParsed.data;
    const pendingImage: Image = {
      updatedAt: image?.updatedAt ?? new Date(),
      createdAt: image?.createdAt ?? new Date(),
      id: image?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingImage,
            action: editing ? 'update' : 'create',
          });

        const { data, error } = editing
          ? await updateImageAction({ ...values, id: image.id })
          : await createImageAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingImage,
        };

        onSuccess(
          editing ? 'update' : 'create',
          error ? errorFormatted : undefined,
        );

        if (data) {
          setActiveImage && setActiveImage(data.image);
        }
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  const [images, setImages] = useState<FileList | null>(null);
  const handleSubmitWrapper = handleSubmit.bind(null, { images });

  return (
    <form
      action={handleSubmitWrapper}
      onChange={handleChange}
      className={'space-y-8'}
    >
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            'mb-2 inline-block',
            errors?.url ? 'text-destructive' : '',
          )}
        >
          Url
        </Label>
        <Input
          type="file"
          name="url"
          accept="image/*"
          className={cn(errors?.url ? 'ring ring-destructive' : '')}
          defaultValue={image?.url ?? ''}
          onChange={(e) => {
            setImages(e.target.files);
          }}
        />
        {errors?.url ? (
          <p className="text-xs text-destructive mt-2">{errors.url[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: 'delete', data: image });
              const error = await deleteImageAction(image.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: image,
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

export default ImageForm;

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
