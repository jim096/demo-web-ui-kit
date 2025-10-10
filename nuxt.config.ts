// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },
  
  // Cấu hình pages
  pages: true,
  
  modules: [
    '@nuxt/ui',
    '@nuxtjs/color-mode'
  ],
  
  // Cấu hình UI
  ui: {
    global: true,
    icons: ['heroicons']
  },

  // Import CSS
  css: [
    '~/assets/css/main.css'
  ],

  // Cấu hình PostCSS cho Tailwind v4
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
})
