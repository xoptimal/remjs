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
 * @param callback
 */
function readFile(filePath: string, callback: (content: string) => void) {
    if (hot) {
        hot.send('rem:readFile', {filePath, callback})
    } else {
        throw new Error('请检查是否完成初始化!')
    }
}

/**
 * 监听回调
 * @param callback
 */
function addFileListener(callback: (file: FileType) => void) {
    if (hot) {
        hot.on('rem:getFileContent', (response) => {
            callback?.(response);
        })
    }
}


export default {init, readFile, addFileListener}