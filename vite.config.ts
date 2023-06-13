import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            less: {
                math: 'parens-division',
                javascriptEnabled: true,
            },
        }
    },
    define: {
        "process.env.TESS_ENV": process.env.ENV,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        svgr({
            //svgrOptions: {icon: true},
            exportAsDefault: true,
        },),
        react()
    ]
})
