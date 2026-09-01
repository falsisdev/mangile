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
    :speed="1000"
    :autoplay-delay="5000"
    :pagination="{
      clickable: true
    }"
  >
    <swiper-slide
      v-for="slide in slides"
      :key="slide.title"
    >
      <section class="relative h-[420px] md:h-[500px] lg:h-[560px] xl:h-[620px] overflow-hidden rounded-2xl md:rounded-3xl">
        <div
          class="absolute inset-0 bg-cover bg-center slide-bg-layer"
          :style="{
            backgroundImage: `url(${slide.banner})`
          }"
        />
        <div
          class="absolute inset-0 bg-linear-to-r from-black/95 via-black/70 to-black/20 sm:to-transparent z-10"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 sm:via-transparent to-transparent z-10"
        />

        <UContainer class="relative z-20 flex h-full items-center pb-6 sm:pb-0">
          <div class="max-w-2xl space-y-2.5 sm:space-y-4 text-white content-layer">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <UBadge
                v-if="slide.type"
                color="neutral"
                variant="soft"
                size="sm"
                class="sm:hidden font-medium"
              >
                {{ slide.type }}
              </UBadge>
              <UBadge
                v-if="slide.type"
                color="neutral"
                variant="soft"
                size="lg"
                class="hidden sm:inline-flex"
              >
                {{ slide.type }}
              </UBadge>

              <UBadge
                v-if="slide.year"
                color="neutral"
                variant="soft"
                size="sm"
                class="sm:hidden font-medium"
              >
                {{ slide.year }}
              </UBadge>
              <UBadge
                v-if="slide.year"
                color="neutral"
                variant="soft"
                size="lg"
                class="hidden sm:inline-flex"
              >
                {{ slide.year }}
              </UBadge>

              <UBadge
                v-if="slide.score && Number(slide.score) > 0"
                icon="i-lucide-star"
                color="warning"
                variant="soft"
                size="sm"
                class="sm:hidden font-bold"
              >
                {{ slide.score }}
              </UBadge>
              <UBadge
                v-if="slide.score && Number(slide.score) > 0"
                icon="i-lucide-star"
                color="warning"
                variant="soft"
                size="md"
                class="hidden sm:inline-flex"
              >
                {{ slide.score }}
              </UBadge>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black line-clamp-2 text-white leading-tight tracking-tight drop-shadow-md">
              {{ slide.title }}
            </h1>

            <p class="max-w-xl text-sm sm:text-sm md:text-base text-gray-200 line-clamp-4 sm:line-clamp-4 md:line-clamp-6 leading-relaxed drop-shadow-xs">
              {{ slide.description ? slide.description.replaceAll(/<[^>]*>/g, '') : '' }}
            </p>

            <div class="flex items-center gap-2 sm:gap-3 pt-1">
              <UButton
                :to="'/title/' + slide.id"
                size="sm"
                icon="i-lucide-info"
                class="cursor-pointer sm:hidden"
                variant="solid"
                color="neutral"
              >
                Detaylar
              </UButton>
              <UButton
                :to="'/title/' + slide.id"
                size="lg"
                icon="i-lucide-info"
                class="cursor-pointer hidden sm:inline-flex"
                variant="solid"
                color="neutral"
              >
                Detaylar
              </UButton>

              <UButton
                :to="'/synch?mal_id=' + slide.id"
                size="sm"
                color="neutral"
                variant="subtle"
                icon="i-lucide-cloud-backup"
                class="cursor-pointer sm:hidden"
              >
                Senkronize Et
              </UButton>
              <UButton
                :to="'/synch?mal_id=' + slide.id"
                size="lg"
                color="neutral"
                variant="subtle"
                icon="i-lucide-cloud-backup"
                class="cursor-pointer hidden sm:inline-flex"
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
  opacity: 0.5;
  transition:
    width 0.3s ease,
    background-color 0.3s ease,
    opacity 0.3s ease;
}

swiper-container::part(bullet-active) {
  width: 32px;
  border-radius: 999px;
  background-color: white;
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
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
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
    transform: scale(1.08) translateZ(0);
  }
}
</style>
