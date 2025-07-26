<script setup>
import { Icon } from '@iconify/vue'
</script>
<template>
    <div class="w-full max-w-lg items-center flex flex-row backdrop-blur-md absolute z-50 mt-2">
        <Input id="search" type="text" placeholder="Ara..." class="rounded-r-none max-w-screen ml-1 w-full" />
        <Button variant="outline" class="rounded-l-none mr-1">
            <Icon icon="material-symbols:search-rounded" />
        </Button>
    </div>
</template>