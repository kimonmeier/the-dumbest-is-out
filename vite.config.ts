import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	resolve: {
		alias: {
			'@server': path.resolve('src/server/'),
			'@gameshow-lib': path.resolve('src/lib/'),
			'@client': path.resolve('src/client/')
		}
	},
	plugins: [tailwindcss(), sveltekit()],
	build: {
		sourcemap: true,
		cssMinify: true,
		ssr: true
	},
	server: {
		proxy: {
			'/socket.io': {
				target: 'http://localhost:3000/socket.io',
				changeOrigin: true,
				secure: false,
				ws: true,
				configure: (proxy, _options) => {
					proxy.on('error', (err, _req, _res) => {
						console.log('proxy error', err);
					});
					proxy.on('proxyReq', (proxyReq, req, _res) => {
						console.log('Sending Request to the Target:', req.method, req.url);
					});
					proxy.on('proxyRes', (proxyRes, req, _res) => {
						console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
					});
				}
			}
		}
	}
});
