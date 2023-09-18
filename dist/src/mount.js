import { createInstance } from './createInstance';
import { trackInstance } from './utils/autoUnmount';
import { createVueWrapper } from './wrapperFactory';
// implementation
export function mount(inputComponent, options) {
    const { app, props, componentRef } = createInstance(inputComponent, options);
    const setProps = (newProps) => {
        for (const [k, v] of Object.entries(newProps)) {
            props[k] = v;
        }
        return vm.$nextTick();
    };
    // Workaround for https://github.com/vuejs/core/issues/7020
    const originalErrorHandler = app.config.errorHandler;
    let errorOnMount = null;
    app.config.errorHandler = (err, instance, info) => {
        errorOnMount = err;
        return originalErrorHandler === null || originalErrorHandler === void 0 ? void 0 : originalErrorHandler(err, instance, info);
    };
    // mount the app!
    const el = document.createElement('div');
    if (options === null || options === void 0 ? void 0 : options.attachTo) {
        let to;
        if (typeof options.attachTo === 'string') {
            to = document.querySelector(options.attachTo);
            if (!to) {
                throw new Error(`Unable to find the element matching the selector ${options.attachTo} given as the \`attachTo\` option`);
            }
        }
        else {
            to = options.attachTo;
        }
        to.appendChild(el);
    }
    const vm = app.mount(el);
    if (errorOnMount) {
        throw errorOnMount;
    }
    app.config.errorHandler = originalErrorHandler;
    const appRef = componentRef.value;
    // we add `hasOwnProperty` so Jest can spy on the proxied vm without throwing
    // note that this is not necessary with Jest v27+ or Vitest, but is kept for compatibility with older Jest versions
    if (!app.hasOwnProperty) {
        appRef.hasOwnProperty = (property) => {
            return Reflect.has(appRef, property);
        };
    }
    const wrapper = createVueWrapper(app, appRef, setProps);
    trackInstance(wrapper);
    return wrapper;
}
export const shallowMount = (component, options) => {
    return mount(component, Object.assign(Object.assign({}, options), { shallow: true }));
};
