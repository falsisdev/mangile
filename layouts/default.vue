<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="overflow-auto max-w-screen w-full">
      <div>
        <SidebarTrigger class="absolute z-20 bg-sidebar -ml-1 rounded-none rounded-br-lg cursor-pointer" />
        <div class="flex flex-row justify-center">
          <AppNavbar />
        </div>
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>