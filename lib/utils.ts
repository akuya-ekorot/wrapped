import { customAlphabet } from 'nanoid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from './supabase/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789');

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

export const uploadImageAction = async (file: File) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const { data, error } = await supabase.storage
    .from('wrapped')
    .upload(nanoid(), file);

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('wrapped').getPublicUrl(data.path);

  return publicUrl;
};

export type Action = 'create' | 'update' | 'delete';

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};

export type Action = 'create' | 'update' | 'delete';

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};
