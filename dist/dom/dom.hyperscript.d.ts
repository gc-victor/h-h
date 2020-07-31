import { HTMLElements, HTMLElementsAttributes } from './dom.types';
export declare function h<T extends HTMLElements>(tagName: T, attributes: HTMLElementsAttributes[T], children: any[]): (options?: {
    skip: boolean;
    key?: string | undefined;
    elementAttached?: Function | undefined;
    elementDetached?: Function | undefined;
}) => any;
