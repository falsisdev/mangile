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
        <svg class="w-12 h-12 text-primary mb-2 animate-spin" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><path fill="#ffffff" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        <span v-if="props.type == 'default'" class="opacity-75 text-sm">{{ props.what || '' }} Yükleniyor...</span>
        <p v-if="props.type == 'app'" class="mt-4 text-lg text-primary font-semibold">Bunu Biliyor Muydunuz?</p>
        <p v-if="props.type == 'app'" class="text-md text-primary"> {{ infos[Math.floor(Math.random() * infos.length)]
        }}</p>
    </main>
</template>