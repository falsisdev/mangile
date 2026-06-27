<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="link"
    size="icon"
    :class="cn('h-8 w-9', props.class)"
    @click="toggleSidebar"
  >
    <Icon name="material-symbols:left-panel-close-outline" class="text-lg p-2" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
