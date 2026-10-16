<script setup lang="ts">
const { $pwa } = useNuxtApp()

const needRefresh = computed(() => {
  return !!$pwa?.needRefresh
})

async function onRefresh() {
  if ($pwa?.updateServiceWorker) {
    await $pwa.updateServiceWorker(true)
  }
}

function onDismiss() {
  if ($pwa?.cancelPrompt) {
    $pwa.cancelPrompt()
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-4 opacity-0 scale-95"
    enter-to-class="transform translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100 scale-100"
    leave-to-class="transform translate-y-4 opacity-0 scale-95"
  >
    <div
      v-if="needRefresh"
      class="fixed bottom-20 md:bottom-6 right-3 md:right-6 z-50 max-w-sm w-[calc(100vw-1.5rem)] sm:w-auto p-3.5 rounded-2xl bg-neutral-900/95 text-white border border-neutral-700/60 shadow-2xl backdrop-blur-xl flex items-center gap-3 select-none"
      role="alert"
      aria-live="polite"
    >
      <div class="size-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
        <UIcon
          name="i-lucide-sparkles"
          class="size-5 text-primary"
        />
      </div>

      <div class="flex-1 min-w-0 pr-1">
        <p class="text-xs font-semibold text-white leading-tight">
          Yeni sürüm hazır
        </p>
        <p class="text-[11px] text-neutral-300 mt-0.5 line-clamp-1">
          Son güncellemeleri almak için yenileyin
        </p>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <UButton
          size="xs"
          color="primary"
          variant="solid"
          label="Yenile"
          class="font-medium"
          @click="onRefresh"
        />
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          aria-label="Kapat"
          @click="onDismiss"
        />
      </div>
    </div>
  </Transition>
</template>
