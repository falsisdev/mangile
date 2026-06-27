<template>
    <SidebarProvider :default-open="false">
        <AppSidebar />
        <main class="w-screen">
            <SidebarTrigger class="absolute z-20 bg-sidebar ml-2 border-1 rounded-none rounded-lg cursor-pointer top-0 mt-2" />
            <div class="flex flex-row justify-center relative ">
                <AppNavbar />
            </div>
            <slot />
        </main>
    </SidebarProvider>
</template>