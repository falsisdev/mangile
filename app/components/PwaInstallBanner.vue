<script setup lang="ts">
const {
  canInstall,
  isInstalled,
  showIOSGuide,
  isBannerDismissed,
  promptInstall,
  dismissBanner
} = usePwaInstall()

const showBanner = computed(() => {
  if (isInstalled.value) return false
  if (isBannerDismissed.value) return false
  return canInstall.value
})

async function onInstallClick() {
  await promptInstall()
}
</script>

<template>
  <div>
    <!-- Install Prompt Bottom Floating Banner -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-6 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-6 opacity-0"
    >
      <aside
        v-if="showBanner"
        class="fixed bottom-16 md:bottom-6 left-3 sm:left-6 z-40 max-w-sm w-[calc(100vw-1.5rem)] sm:w-80 p-3 rounded-2xl bg-neutral-900/95 dark:bg-neutral-900/95 text-white border border-neutral-700/60 shadow-2xl backdrop-blur-xl flex items-center gap-3 select-none"
        aria-label="Uygulama Yükleme Bildirimi"
      >
        <img
          src="/pwa-192x192.png"
          alt="Mangile"
          class="size-10 rounded-xl shadow-md shrink-0"
        >

        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-white tracking-tight truncate">
            Mangile Uygulaması
          </p>
          <p class="text-[11px] text-neutral-300 line-clamp-1">
            Daha hızlı ve çevrimdışı okuma
          </p>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <UButton
            size="xs"
            color="primary"
            variant="solid"
            label="Yükle"
            icon="i-lucide-download"
            class="font-semibold text-xs"
            @click="onInstallClick"
          />
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            aria-label="Kapat"
            @click="dismissBanner"
          />
        </div>
      </aside>
    </Transition>

    <!-- iOS "Ana Ekrana Ekle" Guide Modal -->
    <UModal
      v-model:open="showIOSGuide"
      title="Uygulamayı Ana Ekrana Ekle"
      description="Mangile'ı iPhone veya iPad'inize yükleyin"
    >
      <template #body>
        <div class="space-y-4 py-2">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <div class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <UIcon
                name="i-lucide-share"
                class="size-5"
              />
            </div>
            <div class="text-xs space-y-0.5">
              <p class="font-semibold text-foreground">
                1. Paylaş Simgesine Dokunun
              </p>
              <p class="text-muted">
                Safari tarayıcısının altındaki Paylaş (kare içinden çıkan ok) butonuna dokunun.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <div class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <UIcon
                name="i-lucide-plus-square"
                class="size-5"
              />
            </div>
            <div class="text-xs space-y-0.5">
              <p class="font-semibold text-foreground">
                2. 'Ana Ekrana Ekle'yi Seçin
              </p>
              <p class="text-muted">
                Açılan menüde aşağı kaydırarak 'Ana Ekrana Ekle' seçeneğine ve ardından 'Ekle'ye dokunun.
              </p>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
            label="Anladım"
            color="primary"
            size="sm"
            @click="void (showIOSGuide = false)"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
