import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type OptionValueId,
  optionValueIdSchema,
  optionValues,
} from '@/lib/db/schema/optionValues';
import { options } from '@/lib/db/schema/options';

export const getOptionValues = async () => {
  const rows = await db
    .select({ optionValue: optionValues, option: options })
    .from(optionValues)
    .leftJoin(options, eq(optionValues.optionId, options.id));
  const o = rows.map((r) => ({ ...r.optionValue, option: r.option }));
  return { optionValues: o };
};

export const getOptionValueById = async (id: OptionValueId) => {
  const { id: optionValueId } = optionValueIdSchema.parse({ id });
  const [row] = await db
    .select({ optionValue: optionValues, option: options })
    .from(optionValues)
    .where(eq(optionValues.id, optionValueId))
    .leftJoin(options, eq(optionValues.optionId, options.id));
  if (row === undefined) return {};
  const o = { ...row.optionValue, option: row.option };
  return { optionValue: o };
};
