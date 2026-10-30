<script setup lang="ts">
import {
  ACCENT_THEME_OPTIONS,
  DEFAULT_GLASS_INTENSITY,
  GLASS_INTENSITY_PRESETS,
  NEUTRAL_THEME_OPTIONS,
  OS_THEME_OPTIONS
} from '~/utils/osTheme'

withDefaults(
  defineProps<{
    mode?: 'popover' | 'inline'
  }>(),
  {
    mode: 'popover'
  }
)

const isOpen = shallowRef(false)
const colorMode = useColorMode()

const {
  osPreference,
  detectedOsLabel,
  resolvedOsLabel,
  resolvedOsSubtitle,
  accentPreference,
  neutralPreference,
  glassIntensity,
  isAppleTheme,
  setOsPreference,
  setAccentPreference,
  setNeutralPreference,
  setGlassIntensity,
  resetAllThemePreferences
} = useOsTheme()

const hasCustomPreferences = computed(() => {
  return (
    osPreference.value !== 'auto'
    || accentPreference.value !== 'os-default'
    || neutralPreference.value !== 'os-default'
    || glassIntensity.value !== DEFAULT_GLASS_INTENSITY
  )
})

function onGlassSliderInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (target) {
    setGlassIntensity(Number(target.value))
  }
}

const colorModeItems = [
  { value: 'system', label: 'Sistem', icon: 'i-lucide-monitor' },
  { value: 'light', label: 'Açık', icon: 'i-lucide-sun' },
  { value: 'dark', label: 'Koyu', icon: 'i-lucide-moon' }
] as const
</script>

<template>
  <div
    v-if="mode === 'inline'"
    class="space-y-4"
  >
    <div class="flex items-center justify-between gap-2">
      <div>
        <h4 class="text-xs sm:text-sm font-bold text-highlighted">
          Arayüz & Tasarım Dili
        </h4>
        <p class="text-[11px] text-muted">
          Aktif: {{ resolvedOsLabel }} ({{ resolvedOsSubtitle }})
        </p>
      </div>
      <UButton
        v-if="hasCustomPreferences"
        size="xs"
        variant="ghost"
        color="neutral"
        icon="i-lucide-rotate-ccw"
        label="Sıfırla"
        @click="resetAllThemePreferences"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <button
        v-for="opt in OS_THEME_OPTIONS"
        :key="opt.value"
        type="button"
        class="flex items-center gap-2.5 p-2.5 text-left transition-all cursor-pointer rounded-(--os-input-radius) border"
        :class="
          osPreference === opt.value
            ? 'border-primary bg-primary/10 text-highlighted shadow-xs'
            : 'border-default bg-elevated/50 hover:bg-elevated text-default'
        "
        @click="setOsPreference(opt.value)"
      >
        <div
          class="size-8 rounded-lg flex items-center justify-center shrink-0"
          :class="osPreference === opt.value ? 'bg-primary text-inverted' : 'bg-muted text-muted'"
        >
          <UIcon
            :name="opt.icon"
            class="size-4"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold truncate">{{ opt.label }}</span>
            <span
              v-if="opt.value === 'auto'"
              class="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold shrink-0"
            >
              {{ detectedOsLabel }}
            </span>
          </div>
          <p class="text-[10px] text-muted truncate">
            {{ opt.subtitle }}
          </p>
        </div>
      </button>
    </div>

    <div
      v-if="isAppleTheme"
      class="space-y-2 p-3 rounded-(--os-input-radius) border border-default bg-elevated/40"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-semibold text-highlighted flex items-center gap-1.5">
          <UIcon
            name="i-lucide-sparkles"
            class="size-3.5 text-primary"
          />
          <span>Liquid Glass Oranı</span>
        </span>
        <span class="text-xs font-mono font-bold text-primary">%{{ glassIntensity }}</span>
      </div>

      <input
        :value="glassIntensity"
        type="range"
        min="0"
        max="100"
        step="1"
        class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
        aria-label="Liquid Glass Şeffaflık ve Bulanıklık Oranı"
        @input="onGlassSliderInput"
      >

      <div class="grid grid-cols-4 gap-1.5 pt-0.5">
        <button
          v-for="preset in GLASS_INTENSITY_PRESETS"
          :key="preset.value"
          type="button"
          class="px-2 py-1 rounded-(--os-btn-radius) border text-[10px] font-semibold transition-all cursor-pointer"
          :class="
            Math.abs(glassIntensity - preset.value) <= 5
              ? 'border-primary bg-primary text-inverted'
              : 'border-default bg-elevated/60 hover:bg-elevated text-muted'
          "
          @click="setGlassIntensity(preset.value)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <div class="space-y-1.5">
      <span class="text-[11px] font-semibold text-muted uppercase tracking-wider">Görünüm Modu</span>
      <div class="os-segmented w-full grid grid-cols-3">
        <button
          v-for="cm in colorModeItems"
          :key="cm.value"
          type="button"
          class="os-segmented-btn"
          :data-active="colorMode.preference === cm.value"
          @click="colorMode.preference = cm.value"
        >
          <UIcon
            :name="cm.icon"
            class="size-3.5"
          />
          <span>{{ cm.label }}</span>
        </button>
      </div>
    </div>

    <div class="space-y-1.5">
      <span class="text-[11px] font-semibold text-muted uppercase tracking-wider">Vurgu Rengi</span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="acc in ACCENT_THEME_OPTIONS"
          :key="acc.value"
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-(--os-btn-radius) border text-xs font-medium transition-all cursor-pointer"
          :class="
            accentPreference === acc.value
              ? 'border-primary bg-primary/12 text-highlighted font-bold ring-1 ring-primary/30'
              : 'border-default bg-elevated/50 hover:bg-elevated text-muted'
          "
          @click="setAccentPreference(acc.value)"
        >
          <span
            class="size-3 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/20"
            :class="acc.swatch"
          />
          <span>{{ acc.label }}</span>
        </button>
      </div>
    </div>

    <div class="space-y-1.5">
      <span class="text-[11px] font-semibold text-muted uppercase tracking-wider">Yüzey Tonu</span>
      <div class="grid grid-cols-5 gap-1.5">
        <button
          v-for="neu in NEUTRAL_THEME_OPTIONS"
          :key="neu.value"
          type="button"
          class="px-2 py-1 rounded-(--os-input-radius) border text-[11px] font-medium transition-all truncate cursor-pointer"
          :class="
            neutralPreference === neu.value
              ? 'border-primary bg-primary/12 text-primary font-bold'
              : 'border-default bg-elevated/40 hover:bg-elevated text-muted'
          "
          @click="setNeutralPreference(neu.value)"
        >
          {{ neu.label }}
        </button>
      </div>
    </div>
  </div>

  <UPopover
    v-else
    v-model:open="isOpen"
    :ui="{ content: 'w-80 sm:w-88 p-3.5 os-popover-surface max-h-[85dvh] overflow-y-auto' }"
  >
    <UButton
      icon="i-lucide-sliders-horizontal"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Arayüz ve Tema Tercihleri"
    />

    <template #content>
      <div class="space-y-3.5 select-none">
        <!-- Başlık & Aktif Tema Bilgisi -->
        <div class="flex items-start justify-between gap-2 pb-2 border-b border-default">
          <div>
            <p class="text-xs sm:text-sm font-bold text-highlighted flex items-center gap-1.5">
              <UIcon
                name="i-lucide-palette"
                class="size-4 text-primary"
              />
              <span>Tasarım & Tema</span>
            </p>
            <p class="text-[10px] text-muted mt-0.5">
              {{ resolvedOsLabel }} • {{ resolvedOsSubtitle }}
            </p>
          </div>
          <UButton
            v-if="hasCustomPreferences"
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-rotate-ccw"
            label="Sıfırla"
            @click="resetAllThemePreferences"
          />
        </div>

        <!-- 1. İşletim Sistemi Tasarım Dili -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold text-muted uppercase tracking-wider">Tasarım Dili</span>
            <span class="text-[10px] font-medium text-primary">
              Cihaz: {{ detectedOsLabel }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-1.5">
            <button
              v-for="opt in OS_THEME_OPTIONS"
              :key="opt.value"
              type="button"
              class="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-(--os-input-radius) border text-left transition-all cursor-pointer"
              :class="
                osPreference === opt.value
                  ? 'border-primary bg-primary/12 text-highlighted shadow-2xs'
                  : 'border-default/60 bg-elevated/40 hover:bg-elevated text-default'
              "
              @click="setOsPreference(opt.value)"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  :class="osPreference === opt.value ? 'bg-primary text-inverted' : 'bg-muted/70 text-muted'"
                >
                  <UIcon
                    :name="opt.icon"
                    class="size-3.5"
                  />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold truncate">{{ opt.label }}</span>
                    <span
                      v-if="opt.value === 'auto'"
                      class="text-[9px] px-1.5 py-0.2 rounded-full bg-primary/15 text-primary font-semibold"
                    >
                      {{ detectedOsLabel }}
                    </span>
                  </div>
                  <p class="text-[10px] text-muted truncate">
                    {{ opt.subtitle }}
                  </p>
                </div>
              </div>
              <UIcon
                v-if="osPreference === opt.value"
                name="i-lucide-check"
                class="size-4 text-primary shrink-0"
              />
            </button>
          </div>
        </div>

        <!-- Liquid Glass Oranı (iOS/iPadOS 27 & macOS 27 için) -->
        <div
          v-if="isAppleTheme"
          class="space-y-2 p-2.5 rounded-(--os-input-radius) border border-default/60 bg-elevated/35"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] font-semibold text-highlighted flex items-center gap-1.5">
              <UIcon
                name="i-lucide-sparkles"
                class="size-3.5 text-primary"
              />
              <span>Liquid Glass Oranı</span>
            </span>
            <span class="text-[11px] font-mono font-bold text-primary">%{{ glassIntensity }}</span>
          </div>

          <input
            :value="glassIntensity"
            type="range"
            min="0"
            max="100"
            step="1"
            class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
            aria-label="Liquid Glass Şeffaflık ve Bulanıklık Oranı"
            @input="onGlassSliderInput"
          >

          <div class="grid grid-cols-4 gap-1">
            <button
              v-for="preset in GLASS_INTENSITY_PRESETS"
              :key="preset.value"
              type="button"
              class="px-1.5 py-1 rounded-(--os-btn-radius) border text-[10px] font-semibold transition-all cursor-pointer"
              :class="
                Math.abs(glassIntensity - preset.value) <= 5
                  ? 'border-primary bg-primary text-inverted'
                  : 'border-default/60 bg-elevated/50 hover:bg-elevated text-muted'
              "
              @click="setGlassIntensity(preset.value)"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <!-- 2. Görünüm Modu (Light / Dark / System) -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-semibold text-muted uppercase tracking-wider">Görünüm</span>
          <div class="os-segmented w-full grid grid-cols-3">
            <button
              v-for="cm in colorModeItems"
              :key="cm.value"
              type="button"
              class="os-segmented-btn py-1 text-[11px]"
              :data-active="colorMode.preference === cm.value"
              @click="colorMode.preference = cm.value"
            >
              <UIcon
                :name="cm.icon"
                class="size-3.5"
              />
              <span>{{ cm.label }}</span>
            </button>
          </div>
        </div>

        <!-- 3. Vurgu Rengi -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-semibold text-muted uppercase tracking-wider">Vurgu Rengi</span>
          <div class="grid grid-cols-4 gap-1.5">
            <button
              v-for="acc in ACCENT_THEME_OPTIONS"
              :key="acc.value"
              type="button"
              class="flex items-center gap-1.5 px-2 py-1.5 rounded-(--os-input-radius) border text-[11px] font-medium transition-all cursor-pointer truncate"
              :class="
                accentPreference === acc.value
                  ? 'border-primary bg-primary/12 text-highlighted font-bold'
                  : 'border-default/60 bg-elevated/40 hover:bg-elevated text-muted'
              "
              @click="setAccentPreference(acc.value)"
            >
              <span
                class="size-2.5 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                :class="acc.swatch"
              />
              <span class="truncate">{{ acc.label }}</span>
            </button>
          </div>
        </div>

        <!-- 4. Yüzey Tonu -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-semibold text-muted uppercase tracking-wider">Yüzey Tonu</span>
          <div class="grid grid-cols-5 gap-1">
            <button
              v-for="neu in NEUTRAL_THEME_OPTIONS"
              :key="neu.value"
              type="button"
              class="px-1.5 py-1 rounded-(--os-input-radius) border text-[10px] font-medium transition-all truncate text-center cursor-pointer"
              :class="
                neutralPreference === neu.value
                  ? 'border-primary bg-primary/12 text-primary font-bold'
                  : 'border-default/50 bg-elevated/30 hover:bg-elevated text-muted'
              "
              @click="setNeutralPreference(neu.value)"
            >
              {{ neu.label }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
