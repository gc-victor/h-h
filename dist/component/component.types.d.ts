export interface Props {
    readonly [key: string]: any;
}
export interface Component {
    props?: Props;
    render?: Render;
}
export interface ComponentOptions {
    created: Created;
    deleted: Deleted;
    execute: Execute;
    key: string;
    update: Update;
    props?: Props;
}
export declare type Execute = (callback: () => void, dep: any[]) => void;
export declare type Created = (callback: (element: Element) => void) => void;
export declare type Render = (options: ComponentOptions) => (props: Props) => Element;
export declare type Deleted = (callback: (element: Element) => void) => void;
export declare type Update = <S>(initialState: S) => UpdateResponse<S>;
export declare type UpdateResponse<S> = [S, (initialValue: S) => void];
