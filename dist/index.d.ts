import { Plugin } from "vite";
export declare type Options = {
    /**
     * How <symbol> id attribute should be named
     * Default behavior: /@/icons/example.svg => example
     */
    symbolId?: (name: string, path: string) => string;
    /**
     * Remove attributes also include members in  style sttr
     * @default ['width','height']
     */
    removeAttrs?: string[];
    component?: {
        /** The export component type, Only Vue now */
        type: 'vue';
        /** export const [exportName] as VNode
     * Default behavior: icon-example => IconExample
     */
        exportName?: (name: string, path: string) => string;
        /**
         *  export default [exportName] as VNode
         * @default false
         */
        defaultExport?: boolean;
    };
};
declare function createPlugin(options?: Options): Plugin;
export default createPlugin;
