import { defineNuxtConfig } from 'nuxt/config'
import os from 'os'

// Polyfill os.availableParallelism for older Node versions
if (!(os as any).availableParallelism) {
  ;(os as any).availableParallelism = () => os.cpus().length
}

export default defineNuxtConfig({
  nitro: {
    devServer: {
      port: parseInt(process.env.PORT || process.env.NUXT_PORT || '3000'),
      host: process.env.NUXT_HOST || '0.0.0.0'
    }
  }
})
