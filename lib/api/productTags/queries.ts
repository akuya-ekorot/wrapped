import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type ProductTagId, productTagIdSchema, productTags } from "@/lib/db/schema/productTags";
import { tags } from "@/lib/db/schema/tags";
import { products } from "@/lib/db/schema/products";

export const getProductTags = async () => {
  const rows = await db.select({ productTag: productTags, tag: tags, product: products }).from(productTags).leftJoin(tags, eq(productTags.tagId, tags.id)).leftJoin(products, eq(productTags.productId, products.id));
  const p = rows .map((r) => ({ ...r.productTag, tag: r.tag, product: r.product})); 
  return { productTags: p };
};

export const getProductTagById = async (id: ProductTagId) => {
  const { id: productTagId } = productTagIdSchema.parse({ id });
  const [row] = await db.select({ productTag: productTags, tag: tags, product: products }).from(productTags).where(eq(productTags.id, productTagId)).leftJoin(tags, eq(productTags.tagId, tags.id)).leftJoin(products, eq(productTags.productId, products.id));
  if (row === undefined) return {};
  const p =  { ...row.productTag, tag: row.tag, product: row.product } ;
  return { productTag: p };
};


