<script setup>
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
    <Card class="w-48 h-[300px] relative overflow-hidden group cursor-pointer">
        <NuxtLink :to="`/title/${id}`">
            <div class="absolute inset-0 z-0">
                <img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    :src="cover" alt="Kapak Fotoğrafı" />
                <div class="absolute inset-0 bg-black/30"></div>
            </div>

            <div class="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black to-transparent">
                <CardHeader class="p-0">
                    <CardTitle class="text-white">
                        {{ title }}
                    </CardTitle>
                    <CardDescription class="text-gray-200">
                        {{ type }}
                    </CardDescription>
                </CardHeader>

                <div v-if="badgeContent" class="mt-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Badge class="bg-white text-black">
                                    {{ badgeContent }}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                {{ badgeTooltip }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </NuxtLink>
    </Card>
</template>