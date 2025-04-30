import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {VitePWA} from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    base: '/',
    plugins: [
        svgr(),
        react(),
        VitePWA({
            injectRegister: 'auto'
        })
    ],
    server: {
        port: 3000,
    },
    build: {
        outDir: 'build'
    }
})