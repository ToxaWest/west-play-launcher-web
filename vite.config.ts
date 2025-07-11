import react from '@vitejs/plugin-react-swc'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr';
export default defineConfig({
    base: '/',
    build: {
        outDir: 'build',
        target: ['chrome138']
    },
    plugins: [
        svgr(),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                clientsClaim: true,
                skipWaiting: true
            }
        })
    ],
    server: {
        port: 3000,
    }
})