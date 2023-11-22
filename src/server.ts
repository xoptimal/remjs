type FileType = {
    path: string
    content: string
}

let hot = import.meta.hot;

/**
 * 初始化上下文
 * @param hotObject 上下文对象
 */
function init(hotObject: any) {
    hot = hotObject;
}

/**
 * 读取文件
 * @param filePath 文件路径
 */
function readFile(filePath: string) {
    if (hot) {
        hot.send('rem:readFile', {filePath})
    } else {
        throw new Error('请检查是否完成初始化!')
    }
}

function writeFile(newContent: string, filePath: string, callback: (response: any) => void) {
    if (hot) {
        hot.on('rem:writeFileCallback', (response) => {
            callback?.(response);
        })
        hot.send('rem:writeFile', {newContent, filePath})
    } else {
        throw new Error('请检查是否完成初始化!')
    }
}


/**
 * 监听回调
 * @param callback
 */
function addGetFileListener(callback: (file: FileType) => void) {
    if (hot) {
        hot.on('rem:getFileContent', (response) => {
            callback?.(response);
        })
    }
}

function addWriteFileListener(callback: (file: FileType) => void) {
    if (hot) {
        hot.on('rem:writeFileCallback', (response) => {
            callback?.(response);
        })
    }
}






export default {init, readFile, writeFile, addGetFileListener}