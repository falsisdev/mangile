<template>
    <div class="flex justify-center items-center h-screen mx-5">
        <Alert class="py-20 border-0">
            <AlertTitle class="flex flex-col items-center text-2xl font-semibold">
                <img src="https://cdn.sanity.io/images/1yge7tlr/production/821814e4761213a1b38eb14df3946a5c34336d20-600x600.png"
                    class="w-50 h-50 mb-5" />
                Yapım Aşamasında!
            </AlertTitle>
            <AlertDescription class="text-center text-md">
                Üzgünüz, Mangile'ın mobil versiyonu henüz yapım aşamasında! Bir masaüstü cihazı kullanarak Mangile'a
                erişebilirsiniz!
            </AlertDescription>
        </Alert>
    </div>
    <!--
    <SidebarProvider>
        <AppSidebar />
        <main class="w-screen">
            <SidebarTrigger class="absolute z-20 bg-sidebar -ml-1 rounded-none rounded-br-lg cursor-pointer" />
            <div class="flex flex-row justify-center">
                <AppNavbar />
            </div>
            <slot />
        </main>
    </SidebarProvider>-->
</template>