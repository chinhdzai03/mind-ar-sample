import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
   plugins: [  basicSsl(), react() ],
   server: {
		https: true, // same as "--https" flag
		host: true, // same as "--host" flag
	},
})
