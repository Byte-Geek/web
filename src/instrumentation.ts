
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
  const payload = await getPayload({ config, cron: true });

  await payload.update({ collection: "payload-jobs", where: { processing: { equals: true } }, data: { processing: false } });
}
