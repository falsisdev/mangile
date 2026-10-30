<script setup lang="ts">
interface Title {
  title: string
  type: string
  year: string
  score: string
  description: string
  banner: string
  id: number
}

withDefaults(
  defineProps<{
    slides?: Title[]
  }>(),
  {
    slides: () => []
  }
)
</script>

<template>
  <swiper-container
    class="hero-slider"
    :loop="true"
    effect="fade"
    :speed="900"
    :autoplay-delay="5000"
    :pagination="{
      clickable: true
    }"
  >
    <swiper-slide
      v-for="slide in slides"
      :key="slide.title"
    >
      <section class="relative h-[330px] xs:h-[370px] sm:h-[430px] md:h-[490px] lg:h-[540px] xl:h-[590px] overflow-hidden rounded-(--os-hero-radius) shadow-lg">
        <div
          class="absolute inset-0 bg-cover bg-center slide-bg-layer"
          :style="{
            backgroundImage: `url(${slide.banner})`
          }"
        />
        <div
          class="absolute inset-0 bg-linear-to-r from-black/92 via-black/68 to-black/20 sm:to-transparent z-10"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/92 via-black/40 sm:via-transparent to-transparent z-10"
        />

        <UContainer class="relative z-20 flex h-full items-end sm:items-center pb-10 sm:pb-0">
          <div class="max-w-2xl space-y-2.5 sm:space-y-4 text-white content-layer">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                v-if="slide.type"
                class="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-(--os-badge-radius) bg-white/15 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-white"
              >
                {{ slide.type }}
              </span>

              <span
                v-if="slide.year"
                class="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-(--os-badge-radius) bg-white/12 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-medium text-white/90"
              >
                {{ slide.year }}
              </span>

              <span
                v-if="slide.score && Number(slide.score) > 0"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-(--os-badge-radius) bg-amber-500/20 backdrop-blur-md border border-amber-400/35 text-[11px] sm:text-xs font-bold text-amber-300"
              >
                <UIcon
                  name="i-lucide-star"
                  class="size-3.5 fill-amber-400 text-amber-400"
                />
                {{ slide.score }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black line-clamp-2 text-white leading-tight tracking-tight drop-shadow-md">
              {{ slide.title }}
            </h1>

            <p class="max-w-xl text-xs sm:text-sm md:text-base text-gray-200/95 line-clamp-3 sm:line-clamp-4 md:line-clamp-5 leading-relaxed drop-shadow-xs">
              {{ slide.description ? slide.description.replaceAll(/<[^>]*>/g, '') : '' }}
            </p>

            <div class="flex items-center gap-2 sm:gap-3 pt-1">
              <UButton
                :to="'/title/' + slide.id"
                size="sm"
                icon="i-lucide-book-open"
                class="cursor-pointer sm:hidden font-bold shadow-md"
                variant="solid"
                color="primary"
              >
                İncele & Oku
              </UButton>
              <UButton
                :to="'/title/' + slide.id"
                size="lg"
                icon="i-lucide-book-open"
                class="cursor-pointer hidden sm:inline-flex font-bold shadow-md"
                variant="solid"
                color="primary"
              >
                İncele & Oku
              </UButton>

              <UButton
                :to="'/sync?mal_id=' + slide.id"
                size="sm"
                color="neutral"
                variant="subtle"
                icon="i-lucide-cloud-backup"
                class="cursor-pointer sm:hidden bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md"
              >
                Senkronize Et
              </UButton>
              <UButton
                :to="'/sync?mal_id=' + slide.id"
                size="lg"
                color="neutral"
                variant="subtle"
                icon="i-lucide-cloud-backup"
                class="cursor-pointer hidden sm:inline-flex bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md"
              >
                Senkronize Et
              </UButton>
            </div>
          </div>
        </UContainer>
      </section>
    </swiper-slide>
  </swiper-container>
</template>

<style scoped>
swiper-container {
  width: 100%;
  height: 100%;
}

swiper-container::part(bullet) {
  background: white;
  opacity: 0.45;
  border-radius: var(--os-btn-radius);
  transition:
    width 0.3s var(--os-ease),
    background-color 0.3s var(--os-ease),
    opacity 0.3s var(--os-ease);
}

swiper-container::part(bullet-active) {
  width: 28px;
  border-radius: var(--os-btn-radius);
  background-color: var(--ui-primary);
  opacity: 1;
}

.slide-bg-layer {
  opacity: 0;
  transform: scale(1) translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}

:deep(.swiper-slide-active) .slide-bg-layer {
  animation: netflixSmoothZoom 6s linear forwards;
}

.content-layer {
  opacity: 0;
  transform: translateY(10px) translateZ(0);
  will-change: transform, opacity;
  transition:
    opacity 0.7s var(--os-ease),
    transform 0.7s var(--os-ease);
}

:deep(.swiper-slide-active) .content-layer {
  opacity: 1;
  transform: translateY(0) translateZ(0);
}

@keyframes netflixSmoothZoom {
  0% {
    opacity: 0;
    transform: scale(1) translateZ(0);
  }

  15% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: scale(1.07) translateZ(0);
  }
}
</style>
