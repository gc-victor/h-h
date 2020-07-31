import { Props, Render } from './component.types';
interface ComponentFactory {
    hooks: any;
    key: string;
    onCreate: (key: string, element: Element) => void;
    onDelete: (key: string, element: Element) => void;
    render: Render;
    newProps: Props;
}
export declare function componentFactory({ hooks, newProps, key, onCreate, onDelete, render, }: ComponentFactory): () => Element | null;
export {};
