// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  vite: {
    ssr: {
      external: ['@prisma/client']
    }
  },  
  
  modules: ["@nuxtjs/tailwindcss", "@prisma/nuxt"],
});
