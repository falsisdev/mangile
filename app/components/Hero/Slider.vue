<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

interface Title {
  title: string
  type: string
  year: string
  score: string
  description: string
  banner: string
  id: number
}

const isSidebarOpen = useSidebar()
const { width } = useWindowSize()

const sectionClass = computed(() => {
  if (width.value >= 1700)
    return `relative ${isSidebarOpen.value ? 'h-[70vh]' : 'h-[70vh]'} overflow-hidden rounded-3xl`
  if (width.value >= 1280)
    return `relative ${isSidebarOpen.value ? 'h-[60vh]' : 'h-[60vh]'} overflow-hidden rounded-3xl`
  if (width.value >= 1024)
    return `relative ${isSidebarOpen.value ? 'h-[60vh]' : 'h-[60vh]'} overflow-hidden rounded-3xl`
  if (width.value >= 768)
    return 'relative h-[70vh] overflow-hidden rounded-3xl'
  if (width.value >= 640)
    return 'relative h-[60vh] overflow-hidden rounded-3xl'
  return 'relative h-[65vh] overflow-hidden rounded-3xl'
})

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
      <section :class="sectionClass">
        <div
          class="absolute inset-0 bg-cover bg-center slide-bg-layer"
          :style="{
            backgroundImage: `url(${slide.banner})`
          }"
        />
        <div
          class="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent z-10"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10"
        />

        <UContainer class="relative z-20 flex h-full items-center">
          <div class="max-w-2xl space-y-4 text-white content-layer">
            <div
              v-if="width >= 640"
              class="flex gap-2"
            >
              <UBadge
                color="neutral"
                variant="soft"
                size="lg"
              >
                {{
                  slide.type
                }}
              </UBadge>
              <UBadge
                color="neutral"
                variant="soft"
                size="lg"
              >
                {{
                  slide.year
                }}
              </UBadge>
              <UBadge
                icon="i-lucide-star"
                color="warning"
                variant="soft"
                size="md"
              >
                {{ slide.score }}
              </UBadge>
            </div>

            <h1 class="text-3xl font-black whitespace-nowrap md:text-6xl">
              {{
                slide.title.length > 23
                  ? slide.title.slice(0, 23) + '...'
                  : slide.title
              }}
            </h1>

            <p class="max-w-xl text-md md:text-lg text-gray-200">
              {{
                slide.description.replaceAll(/<[^>]*>/g, '').length > 400
                  ? slide.description
                    .replaceAll(/<[^>]*> /g, '')
                    .slice(0, 397) + '...'
                  : slide.description.replaceAll(/ <[^>]*>/g, '')
              }}
            </p>

            <div class="flex gap-3">
              <UButton
                :to="'/title/' + slide.id"
                size="lg"
                icon="i-lucide-info"
                class="cursor-pointer"
                variant="solid"
                color="neutral"
              >
                Detaylar
              </UButton>
              <UButton
                :to="'/synch?mal_id=' + slide.id"
                size="lg"
                color="neutral"
                variant="subtle"
                icon="i-lucide-cloud-backup"
                class="cursor-pointer"
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
