import fs from 'fs';

function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('读取文件内容出错:', error);
        return null;
    }
}

export default function remPlugin(options = {mainPath: '/src/main.tsx'}) {
    return [{
        name: 'rem-plugin-react',
        enforce: 'pre',
        apply: "serve",
        configureServer: (server) => {
            server.ws.on('rem:readFile', async (data, client) => {
                try {
                    const fileContent = readFileContent(data.filePath)
                    client.send('rem:getFileContent', {path: data.filePath, content: fileContent})
                } catch (error) {
                }
            })
            server.ws.on('rem:writeFile', async (data, client) => {
                fs.writeFile(data.filePath, data.newContent, (err) => {
                    if (err) {
                        client.send('rem:writeFileCallback', {code: -1, message: `Error writing file: ${err}`})
                    } else {
                        client.send('rem:writeFileCallback', {code: 0, message: 'File updated successfully'})
                    }
                });
            })
        },
        transform(code, id) {
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

