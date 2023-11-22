/// <reference types="react" />

/**
 * 监听回调
 * @param callback
 */
declare function addGetFileListener(callback: (file: FileType) => void): void;

declare const Ball: React.FC;
export default Ball;

declare type FileType = {
    path: string;
    content: string;
};

/**
 * 初始化上下文
 * @param hotObject 上下文对象
 */
declare function init(hotObject: any): void;

/**
 * 读取文件
 * @param filePath 文件路径
 */
declare function readFile(filePath: string): void;

export declare const server: {
    init: typeof init;
    readFile: typeof readFile;
    writeFile: typeof writeFile;
    addGetFileListener: typeof addGetFileListener;
};

declare function writeFile(newContent: string, filePath: string, callback: (response: any) => void): void;

export { }
