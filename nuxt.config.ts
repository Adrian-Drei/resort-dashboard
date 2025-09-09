// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "nuxt-charts",
  ],
  imports: {
    dirs: [
      "constants",
      "./constants/*.ts",
      "./constants/**/*.ts",
      "./types/*.ts",
      "./utils/*.ts",
    ],
  },
  supabase: {
    redirect: false,
  },
});
