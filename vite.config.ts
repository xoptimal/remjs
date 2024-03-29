import {ConfigEnv, defineConfig, UserConfig} from "vite";
import unocss from "unocss/vite";
import react from "@vitejs/plugin-react";
import path, {resolve} from "path";
import dts from 'vite-plugin-dts'
import progress from 'vite-plugin-progress'
import {viteStaticCopy} from 'vite-plugin-static-copy'
import fs from "fs";

// https://vitejs.dev/config/

function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('读取文件内容出错:', error);
        return null;
    }
}

export default defineConfig((mode: ConfigEnv): UserConfig => {
    return {
        // css: {},
        // apply: "serve",
        define: {
            "process.env.TESS_ENV": process.env.ENV,
            //"process.env": process.env
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
                '@assets': path.resolve(__dirname, 'src/assets'),
            },
        },
        // @ts-ignore
        plugins: [unocss(), react(), progress(),
            dts({
            outDir: ['dist', 'types'],
            staticImport: true,
            rollupTypes: true,
            insertTypesEntry: true
        }), viteStaticCopy({targets: [{src: './plugin.js', dest: ''}]}),
            {
                name: 'rem-plugin-react', enforce: 'pre', apply: "serve", configureServer: (server) => {
                    server.ws.on('rem:readFile', async (data, client) => {
                        try {
                            const fileContent = readFileContent(data.filePath)
                            client.send('rem:getFileContent', {path: data.filePath, content: fileContent})
                        } catch (error) {
                        }
                    })
                }}],
        build: {
            sourcemap: true,
            lib: {
                entry: {
                    "index": resolve(__dirname, 'src/index.ts'),
                },
                formats: ['es', 'cjs'],
            },
            rollupOptions: {
                // 确保外部化处理那些你不想打包进库的依赖
                external: ['react', 'react-dom', 'recast', '@babel/standalone', "__vite-browser-external"],
                output: {
                    sourcemap: true,
                    exports: "named"
                },
            },
        },
    }
});
