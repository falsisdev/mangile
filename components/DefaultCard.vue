<script setup>
const props = defineProps({
    cover: String,
    title: String,
    id: Number,
    type: String,
    badgeContent: String,
    badgeTooltip: String,
})

const { isMobile, isTablet } = useDevice();
let layout = ref("default");
if (isMobile) {
  layout.value = "mobile";
} else if (isTablet) {
  layout.value = "tablet";
} else {
  layout.value = "default";
}
</script>
<template>
    <Card :class="`${layout == 'mobile' ? 'w-36 h-[250px]' : 'w-48 h-[300px]'} relative overflow-hidden group cursor-pointer shadow-0 border-0`">
        <NuxtLink :to="`/title/${id}`">
            <div class="absolute inset-0 z-0">
                <img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    :src="cover" alt="Kapak Fotoğrafı" />
                <div class="absolute inset-0 bg-black/30"></div>
            </div>

            <div :class="`${layout == 'mobile' ? 'absolute bg-gradient-to-t from-background to-transparent bottom-0 px-5 py-4 -mx-2' : 'absolute bottom-0 bg-gradient-to-t from-background to-transparent p-4'} left-0 right-0 z-10`">
                <CardHeader class="p-0">
                    <CardTitle :class="`text-white ${layout == 'mobile' ? 'text-sm truncate' : 'text-md truncate'}`">
                        {{ title }}
                    </CardTitle>
                    <CardDescription :class="`text-gray-200 -mt-2 ${layout == 'mobile' ? 'text-xs truncate' : 'text-sm truncate'}`">
                        {{ type }}
                    </CardDescription>
                </CardHeader>

                <div v-if="badgeContent" class="mt-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Badge :class="`bg-white text-black ${layout == 'mobile' ? 'text-[0.625rem] max-w-17 max-h-5' : ''}`">
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