import { pgTableCreator } from 'drizzle-orm/pg-core';
import { env } from '../env.mjs';

export const customPgTable = pgTableCreator(
  (name) => `${env.NEXT_PUBLIC_APP_NAME}_${name}`,
);
