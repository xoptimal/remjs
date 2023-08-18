import { JSX as JSX_2 } from 'react/jsx-runtime';

/**
 * 监听回调
 * @param callback
 */
declare function addFileListener(callback: (file: FileType) => void): void;

declare const _default: (props: RemProps & {
    data?: any;
}) => JSX_2.Element;
export default _default;

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
 * @param callback
 */
declare function readFile(filePath: string, callback: (content: string) => void): void;

declare interface RemProps {
    code?: string;
}

export declare const server: {
    init: typeof init;
    readFile: typeof readFile;
    addFileListener: typeof addFileListener;
};

export { }
