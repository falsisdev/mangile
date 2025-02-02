<template>
  <div class="grid grid-cols-10 min-h-screen">
    <div class="mx-20 my-5 col-span-8 col-start-2 col-end-10 flex-grow">
      <Navbar />
      <slot class="flex-grow" />
      <div class="flex grow"/>
      <div class="divider"/>
      <Footer />
    </div>
  </div>
</template>
