import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config(); // load env vars from .env

export default defineConfig({
  plugins: [
    vue(),
  ],
 

	server: { 
		port: 3000,
	},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import '@/assets/styles/variables.sass'\n`
      }
    }
  },

  base: './',
  define: {
    'WALLET_CONNECT_DEV': `"${process.env.WALLET_CONNECT_DEV}"`,
    'WALLET_CONNECT_PROD': `"${process.env.WALLET_CONNECT_PROD}"`,
    'NODE_ENV': `"${process.env.NODE_ENV}"`,
  }
})
