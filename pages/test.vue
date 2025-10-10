<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Test Page</h1>
    
    <!-- Test UButton -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">UButton Test</h2>
      <UButton variant="solid" color="primary">
        Primary Button
      </UButton>
    </div>

    <!-- Test button với CSS variables trực tiếp -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Direct CSS Variables Test</h2>
      <button 
        class="px-4 py-2 rounded text-white font-medium"
        style="background-color: var(--ui-primary);"
      >
        Direct CSS Variable Button
      </button>
    </div>

    <!-- Test button với màu cứng -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Hard Color Test</h2>
      <button 
        class="px-4 py-2 rounded text-white font-medium bg-green-500"
      >
        Hard Color Button
      </button>
    </div>
  </div>
</template>

<script setup>
// UButton được auto-import
</script>
