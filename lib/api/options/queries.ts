import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type OptionId,
  optionIdSchema,
  options,
} from '@/lib/db/schema/options';
import { products } from '@/lib/db/schema/products';
import {
  optionValues,
  type CompleteOptionValue,
  OptionValue,
} from '@/lib/db/schema/optionValues';

export const getOptions = async () => {
  const rows = await db
    .select({ option: options, product: products, optionValue: optionValues })
    .from(options)
    .leftJoin(products, eq(options.productId, products.id))
    .leftJoin(optionValues, eq(options.id, optionValues.optionId));

  const o = rows.map((r) => ({
    ...r.option,
    product: r.product,
    optionValues: rows
      .filter((r2) => r2.optionValue !== null)
      .filter((o) => o.optionValue!.optionId === r.option.id)
      .map((o) => o.optionValue) as OptionValue[],
  }));

  console.log({ o });

  return { options: o };
};

export const getOptionById = async (id: OptionId) => {
  const { id: optionId } = optionIdSchema.parse({ id });
  const [row] = await db
    .select({ option: options, product: products })
    .from(options)
    .where(eq(options.id, optionId))
    .leftJoin(products, eq(options.productId, products.id));
  if (row === undefined) return {};
  const o = { ...row.option, product: row.product };
  return { option: o };
};

export const getOptionByIdWithOptionValues = async (id: OptionId) => {
  const { id: optionId } = optionIdSchema.parse({ id });
  const rows = await db
    .select({ option: options, optionValue: optionValues })
    .from(options)
    .where(eq(options.id, optionId))
    .leftJoin(optionValues, eq(options.id, optionValues.optionId));
  if (rows.length === 0) return {};
  const o = rows[0].option;
  const oo = rows
    .filter((r) => r.optionValue !== null)
    .map((o) => o.optionValue) as CompleteOptionValue[];

  return { option: o, optionValues: oo };
};
