<template>
  <SidebarProvider :default-open="true">
    <AppSidebar />
    <main class="overflow-auto max-w-screen w-full">
      <div>
        <SidebarTrigger class="fixed z-20 bg-sidebar rounded-none rounded-lg cursor-pointer mt-3 border-2 ml-1" />
        <div class="flex flex-row justify-center">
          <AppNavbar />
        </div>
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>