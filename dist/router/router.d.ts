import { View } from '../app/app.types';
import { RouterOptions } from './router.types';
export declare const redirect: (href: string) => void;
export declare const to: (event: Event) => void;
export declare function router(options: RouterOptions): {
    view: View;
};
