export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const discordPayload = {
    username: "Manila [Content]",
    content: `📢 Veri Tabanında değişiklik: **${body?.document?.title || "Bilinmeyen"}** adlı seri güncellendi.`,
  };

  const discordWebhookUrl: string = String(config.public.manilaContent);

  await $fetch(discordWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: discordPayload,
  });

  return { success: true };
});
