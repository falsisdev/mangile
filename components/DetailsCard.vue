<script setup>
// shadcn-vue Button bileşenini ve Iconify'ı import ediyoruz.
// Yollar projenizin klasör yapısına göre değişiklik gösterebilir (örn: '@/components/ui/button')
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

const props = defineProps({
    cover: String,
    title: String,
    id: Number,
    type: String,
    badgeContent: String,
    badgeTooltip: String,
})
</script>

<template>
    <Card class="w-84 h-48 relative overflow-hidden group">
        <div class="flex h-full">
            <div class="w-1/2 overflow-hidden -mt-6 -mb-6">
                <img
                    class="w-36 object-cover h-full"
                    :src="cover"
                    alt="Kapak Fotoğrafı" />
            </div>

            <div class="w-1/2 flex flex-col justify-between">
                <div>
                    <CardHeader class="-mt-2 -ml-8">
                        <CardTitle>
                            {{ title }}
                        </CardTitle>
                        <CardDescription class="text-gray-200">
                            {{ type }}
                        </CardDescription>
                    </CardHeader>
                </div>

                <div class="flex flex-col gap-1">
                    <div v-if="badgeContent">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <Badge variant="secondary" class="cursor-pointer">
                                        {{ badgeContent }}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {{ badgeTooltip }}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div class="flex justify-end mr-4">
                        <NuxtLink :to="`/title/${id}`">
                            <Button variant="outline" class="cursor-pointer shadow-lg">
                                <Icon icon="mdi:eye" class="mr-2" /> Görüntüle
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>