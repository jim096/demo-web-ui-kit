<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Test Nuxt UI</h1>
    
    <!-- Test UButton -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">UButton Test</h2>
      <div class="space-x-4">
        <UButton variant="solid" color="primary">
          Primary Button
        </UButton>
        <UButton color="primary" variant="outline">
          Outline Button
        </UButton>
        <UButton variant="ghost" color="blue">
          Ghost Button
        </UButton>
      </div>
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

    <!-- Test text với Tailwind -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Tailwind Test</h2>
      <div class="text-primary text-lg">
        Text với màu primary: hoạt động
      </div>
      <div class="text-blue-500 text-lg">
        Text với màu blue: hoạt động
      </div>
    </div>

    <!-- Test button thường để so sánh -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Native Button Test</h2>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Native Button
      </button>
    </div>
  </div>
</template>

<script setup>
// Không cần import gì, UButton được auto-import
</script>