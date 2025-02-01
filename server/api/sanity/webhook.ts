export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const discordPayload = {
    content: `📢 Veri Tabanında değişiklik: **${body?.document?.title || "Bilinmeyen"}** adlı seri güncellendi.`,
  };

  const discordWebhookUrl: string = String(config.public.manilaContent);

  try {
    await $fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: discordPayload,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
