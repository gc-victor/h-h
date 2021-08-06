export declare const redirect: (href: string) => void;
export declare const to: (event: Event) => void;
export declare function router(options: RouterOptions): void;
export interface Params {
    [key: string]: string;
}
export interface RouterOptions {
    [key: string]: {
        id?: string;
        title: (params: Params | undefined) => string;
        view: (params: Params | undefined) => Node;
    };
}
