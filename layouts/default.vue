<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="grid grid-cols-13">
      <div class="col-start-1 col-end-14">
        <!--<SidebarTrigger class="absolute z-20 bg-sidebar -ml-1 rounded-none rounded-br-lg cursor-pointer" />-->
        <div class="flex flex-row justify-center">
          <AppNavbar />
        </div>
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>