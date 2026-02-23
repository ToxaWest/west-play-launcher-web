import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
        target: ['chrome138']
    },
    plugins: [
        tsconfigPaths(),
        svgr(),
        tailwindcss(),
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
