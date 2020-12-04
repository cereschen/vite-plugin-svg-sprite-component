import { Plugin } from "vite";
export declare type Options = {
    /**
     * How <symbol> id attribute should be named;
     * 
     * Default behavior: /@/icons/example.svg => example
     */
    symbolId?: (name: string, path: string) => string;
    /** 
     * @example export const [exportName] as VNode;
     * 
     * Default behavior: icon-example => IconExample
     */
    exportName?: (name: string, path: string) => string;
    /**
     * @example export default [exportName] as VNode;
     * @default false
     */
    defaultExport?: boolean;
    /**
     * Remove attributes also include members in  style sttr
     * @default ['width','height']
     */
    removeAttrs?: string[];
};
declare function createPlugin(options?: Options): Plugin;
export default createPlugin;
