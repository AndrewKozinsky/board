import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	define: {
		global: {
			__PIXI_APP__: '',
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'), // Example alias for `src`
		},
	},
	plugins: [react()],
})
