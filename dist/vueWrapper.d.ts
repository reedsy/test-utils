import { App, ComponentPublicInstance } from 'vue';
import { VueNode } from './types';
import BaseWrapper from './baseWrapper';
import type { DOMWrapper } from './domWrapper';
export declare class VueWrapper<VM = unknown, T extends ComponentPublicInstance = VM & ComponentPublicInstance> extends BaseWrapper<Node> {
    private readonly componentVM;
    private readonly rootVM;
    private readonly __app;
    private readonly __setProps;
    private cleanUpCallbacks;
    constructor(app: App | null, vm: T, setProps?: (props: Record<string, unknown>) => void);
    private get hasMultipleRoots();
    protected getRootNodes(): VueNode[];
    private get parentElement();
    getCurrentComponent(): import("vue").ComponentInternalInstance;
    exists(): boolean;
    findAll<K extends keyof HTMLElementTagNameMap>(selector: K): DOMWrapper<HTMLElementTagNameMap[K]>[];
    findAll<K extends keyof SVGElementTagNameMap>(selector: K): DOMWrapper<SVGElementTagNameMap[K]>[];
    findAll<T extends Element>(selector: string): DOMWrapper<T>[];
    private attachNativeEventListener;
    get element(): Element;
    get vm(): T;
    props(): {
        [key: string]: any;
    };
    props(selector: string): any;
    emitted<T = unknown>(): Record<string, T[]>;
    emitted<T = unknown[]>(eventName: string): undefined | T[];
    isVisible(): boolean;
    setData(data: Record<string, unknown>): Promise<void>;
    setProps(props: Record<string, unknown>): Promise<void>;
    setValue(value: unknown, prop?: string): Promise<void>;
    unmount(): void;
}