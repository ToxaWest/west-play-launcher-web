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
            registerType: 'autoUpdate',
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
                runtimeCaching: [{
                    urlPattern: /^https:\/\/[a-zA-Z0-9]+\.desktophut\.com/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'media',
                        expiration: {
                            maxEntries: 500,
                            maxAgeSeconds: 60 * 60 * 24 * 365
                        },
                        cacheableResponse: {
                            statuses: [200]
                        },
                        rangeRequests: true
                    }
                },{
                    urlPattern: /^https:\/\/[a-zA-Z0-9]+\.gg\.deals/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'media',
                        expiration: {
                            maxEntries: 500,
                            maxAgeSeconds: 60 * 60 * 24 * 365
                        },
                        cacheableResponse: {
                            statuses: [200]
                        },
                        rangeRequests: true
                    }
                },{
                    urlPattern: /^https:\/\/[a-zA-Z0-9]+\.steamstatic\.com/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'media',
                        expiration: {
                            maxEntries: 500,
                            maxAgeSeconds: 60 * 60 * 24 * 365
                        },
                        cacheableResponse: {
                            statuses: [200]
                        },
                        rangeRequests: true
                    }
                },{
                    urlPattern: /^https:\/\/[a-zA-Z0-9]+\.gamestatus\.info/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'media',
                        expiration: {
                            maxEntries: 500,
                            maxAgeSeconds: 60 * 60 * 24 * 365
                        },
                        cacheableResponse: {
                            statuses: [200]
                        },
                        rangeRequests: true
                    }
                }]
            }
        })
    ],
    server: {
        port: 3000,
    },
    build: {
        outDir: 'build'
    }
})