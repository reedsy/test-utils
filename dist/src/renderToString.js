import { renderToString as baseRenderToString } from '@vue/server-renderer';
import { createInstance } from './createInstance';
export function renderToString(component, options) {
    if (options === null || options === void 0 ? void 0 : options.attachTo) {
        console.warn('attachTo option is not available for renderToString');
    }
    const { app } = createInstance(component, options);
    return baseRenderToString(app);
}
