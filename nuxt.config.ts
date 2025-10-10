// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },
  
  // Cấu hình pages
  pages: true,
  
  modules: [
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@tema-software/platform-uikit'
  ],

  // Cấu hình @nuxt/ui
  ui: {
    global: true,
    icons: ['heroicons'],
  },

  colorMode: {
    preference: 'system', // default theme
    fallback: 'light',    // nếu browser không hỗ trợ
    classSuffix: '',      // tránh tạo class kiểu `dark-mode`
  },

  // Import CSS
  css: [
    '@tema-software/platform-uikit/style',
    '~/assets/css/main.css',
  ],

  // Cấu hình build để include platform-uikit
  build: {
    transpile: ['@tema-software/platform-uikit']
  },

  // Cấu hình Vite
  vite: {
    optimizeDeps: {
      include: ['@tema-software/platform-uikit']
    }
  },

  // Cấu hình components auto-import
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ]
})
