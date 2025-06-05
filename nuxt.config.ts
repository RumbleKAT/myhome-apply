import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  nitro: {
    devServer: {
      port: parseInt(process.env.PORT || process.env.NUXT_PORT || '3000'),
      host: process.env.NUXT_HOST || '0.0.0.0'
    }
  }
})
