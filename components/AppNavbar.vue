<script setup>
import { Icon } from '@iconify/vue'
const { isMobile, isMobileOrTablet } = useDevice();
</script>
<template>
    <div v-if="!isMobileOrTablet"
        class="w-full max-w-lg items-center flex flex-row backdrop-blur-md absolute z-50 mt-2">
        <Input id="search" type="text" placeholder="Ara..." class="rounded-r-none max-w-screen ml-1 w-full" />
        <Button variant="outline" class="rounded-l-none mr-1">
            <Icon icon="material-symbols:search-rounded" />
        </Button>
    </div>
    <div v-else-if="isMobile" class="max-w-screen w-sm px-2 items-center flex flex-row absolute z-50 mt-2">
        <Input id="search" type="text" placeholder="Ara..." class="rounded-r-none ml-1 w-full" />
        <Button variant="outline" class="rounded-l-none mr-1">
            <Icon icon="material-symbols:search-rounded" />
        </Button>
    </div>
</template>