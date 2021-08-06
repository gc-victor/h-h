export interface Props {
    readonly [key: string]: any;
}
export declare type Execute = (callback: () => void, dep: any[]) => void;
export declare type Render = (options: ComponentOptions) => (props: Props) => Element;
export declare type Cleanup = (callback: (element: Element) => void) => void;
export declare type Update = <S>(initialState: S) => UpdateState<S>;
export declare type UpdateState<S> = [() => S, (initialValue: S) => void];
export interface ComponentOptions {
    cleanup: Cleanup;
    execute: Execute;
    key: string;
    update: Update;
    [key: string]: any;
}
export declare function component(render: Render): () => (newProps?: Props | undefined) => () => Element | null;
