import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook, PayloadRequest } from "payload";

async function revalidateSite(req: PayloadRequest) {
  if (req.context?.disableRevalidate) return;
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch {
    return;
  }
}

const afterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidateSite(req);
  return doc;
};

const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateSite(req);
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await revalidateSite(req);
  return doc;
};

export const revalidateHooks = { afterChange: [afterChange], afterDelete: [afterDelete] };
