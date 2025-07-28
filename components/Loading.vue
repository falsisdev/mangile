<script setup>
import { Icon } from '@iconify/vue';

const props = defineProps({
    what: String,
    type: String
})

const infos = [
    "Mangile geliştirilmeye 2022'nin üçüncü çeyreğinde başlanmıştır.",
    "Mangile geliştirilmeye başlandığında tek geliştirici Falsis henüz 15 yaşında bir 9. sınıf öğrencisiydi.",
    "Mangile'ın adı Manga ve İngilizce timsah anlamına gelen crocodile'ın birleşmesiyle oluşmuştur.",
    "Mangile'ın geliştirilmesine ilham veren web sitesi MangaDex'tir.",
    "Falsis, Mangile'ı geliştirmeden önce Ani+ adında bir anime sitesi denemesi yapıp vazgeçmişti.",
    "Mangile geliştirilmeye başlandığında, Nuxt 3. sürümü henüz erken erişimde bile değildi.",
    "Mangile geliştirilmeye başlandığında 2022 Dünya Kupası başlamamıştı.",
    "Mangile geliştirilmeye başlandığında 1 Dolar 18 Liraydı.",
    "Mangile'ın planlanan stabil sürüm yayınlanma tarihi, geliştirilmeye başlandığı tarihten daha uzak.",
    "Mangile geliştirilmeye başlandığında 2023 genel seçimlerine 8.5 ay vardı.",
    "Mangile geliştirme sürecinde 4 kere büyük yazılım değişikliğine gitmiştir.",
    "Mangile geliştirilmeye başlandığında Attack On Titan animesi henüz final vermemişti.",
    "Mangile geliştirilmeye başlandığında Chainsaw Man animesi yayınlanmaya yeni başlamıştı.",
    "Ekibimiz tek kişiliktir."
]
</script>
<template>
    <main class="flex flex-col items-center justify-center">
        <Icon icon="svg-spinners:180-ring" class="w-12 h-12 text-primary mb-2" />
        <span v-if="props.type == 'default'" class="opacity-75 text-sm">{{ props.what || '' }} Yükleniyor...</span>
        <p v-if="props.type == 'app'" class="mt-4 text-lg text-primary font-semibold">Bunu Biliyor Muydunuz?</p>
        <p v-if="props.type == 'app'" class="text-md text-primary"> {{ infos[Math.floor(Math.random() * infos.length)]
        }}</p>
    </main>
</template>