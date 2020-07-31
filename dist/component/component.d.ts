import { Props, Render } from './component.types';
export declare function component(render: Render): () => (newProps?: Props | undefined) => () => Element | null;
