import fs from 'fs';

function readFileContent(filePath) {
    try {
        console.log("filePath", filePath)
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('读取文件内容出错:', error);
        return null;
    }
}

export default function remPlugin(options = {mainPath: '/src/main.tsx'}) {
    return [{
        name: 'rem-plugin-react', enforce: 'pre', apply: "serve", configureServer: (server) => {
            server.ws.on('rem:readFile', async (data, client) => {
                try {
                    const fileContent = readFileContent(data.filePath)
                    data.callback(fileContent)
                    client.send('rem:getFileContent', {fileContent})
                } catch (error) {
                }
            })
        }, transform(code, id) {
            if (id.indexOf(options.mainPath) > -1) {
                const importStatement = `
                import "@wishingjs/rem/dist/style.css";
                import Rem, { server } from '@wishingjs/rem';
                server.init(import.meta.hot)
                `;
                const transformedCode = code.replace(/ReactDOM\.createRoot\(.*?\)\.render\((.*?)\)/s, (match, content) => {
                    return match.replace(content, `<>${content}<Rem /></>`);
                });
                return `${importStatement}\n${transformedCode}`;
            }
            return code;
        },
    }]
}

