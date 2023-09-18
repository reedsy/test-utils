import { config } from './config';
function mergeStubs(target, source) {
    if (source.stubs) {
        if (Array.isArray(source.stubs)) {
            source.stubs.forEach((x) => (target[x] = true));
        }
        else {
            for (const [k, v] of Object.entries(source.stubs)) {
                target[k] = v;
            }
        }
    }
}
// perform 1-level-deep-pseudo-clone merge in order to prevent config leaks
// example: vue-router overwrites globalProperties.$router
function mergeAppConfig(configGlobalConfig, mountGlobalConfig) {
    return Object.assign(Object.assign(Object.assign({}, configGlobalConfig), mountGlobalConfig), { globalProperties: Object.assign(Object.assign({}, configGlobalConfig === null || configGlobalConfig === void 0 ? void 0 : configGlobalConfig.globalProperties), mountGlobalConfig === null || mountGlobalConfig === void 0 ? void 0 : mountGlobalConfig.globalProperties) });
}
export function mergeGlobalProperties(mountGlobal = {}) {
    var _a, _b, _c;
    const stubs = {};
    const configGlobal = (_a = config === null || config === void 0 ? void 0 : config.global) !== null && _a !== void 0 ? _a : {};
    mergeStubs(stubs, configGlobal);
    mergeStubs(stubs, mountGlobal);
    const renderStubDefaultSlot = (_c = (_b = mountGlobal.renderStubDefaultSlot) !== null && _b !== void 0 ? _b : (configGlobal.renderStubDefaultSlot || (config === null || config === void 0 ? void 0 : config.renderStubDefaultSlot))) !== null && _c !== void 0 ? _c : false;
    if (config.renderStubDefaultSlot === true) {
        console.warn('config.renderStubDefaultSlot is deprecated, use config.global.renderStubDefaultSlot instead');
    }
    return {
        mixins: [...(configGlobal.mixins || []), ...(mountGlobal.mixins || [])],
        plugins: [...(configGlobal.plugins || []), ...(mountGlobal.plugins || [])],
        stubs,
        components: Object.assign(Object.assign({}, configGlobal.components), mountGlobal.components),
        provide: Object.assign(Object.assign({}, configGlobal.provide), mountGlobal.provide),
        mocks: Object.assign(Object.assign({}, configGlobal.mocks), mountGlobal.mocks),
        config: mergeAppConfig(configGlobal.config, mountGlobal.config),
        directives: Object.assign(Object.assign({}, configGlobal.directives), mountGlobal.directives),
        renderStubDefaultSlot
    };
}
export const isObject = (obj) => !!obj && typeof obj === 'object';
// https://stackoverflow.com/a/48218209
export const mergeDeep = (target, source) => {
    if (!isObject(target) || !isObject(source)) {
        return source;
    }
    Object.keys(source).forEach((key) => {
        const targetValue = target[key];
        const sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = sourceValue;
        }
        else if (sourceValue instanceof Date) {
            target[key] = sourceValue;
        }
        else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    });
    return target;
};
export function isClassComponent(component) {
    return typeof component === 'function' && '__vccOpts' in component;
}
export function isComponent(component) {
    return Boolean(component &&
        (typeof component === 'object' || typeof component === 'function'));
}
export function isFunctionalComponent(component) {
    return typeof component === 'function' && !isClassComponent(component);
}
export function isObjectComponent(component) {
    return Boolean(component && typeof component === 'object');
}
export function textContent(element) {
    var _a, _b;
    // we check if the element is a comment first
    // to return an empty string in that case, instead of the comment content
    return element.nodeType !== Node.COMMENT_NODE
        ? (_b = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ''
        : '';
}
export function hasOwnProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
}
export function isNotNullOrUndefined(obj) {
    return Boolean(obj);
}
export function isRefSelector(selector) {
    return typeof selector === 'object' && 'ref' in selector;
}
export function convertStubsToRecord(stubs) {
    if (Array.isArray(stubs)) {
        // ['Foo', 'Bar'] => { Foo: true, Bar: true }
        return stubs.reduce((acc, current) => {
            acc[current] = true;
            return acc;
        }, {});
    }
    return stubs;
}
const isDirectiveKey = (key) => key.match(/^v[A-Z].*/);
export function getComponentsFromStubs(stubs) {
    const normalizedStubs = convertStubsToRecord(stubs);
    return Object.fromEntries(Object.entries(normalizedStubs).filter(([key]) => !isDirectiveKey(key)));
}
export function getDirectivesFromStubs(stubs) {
    const normalizedStubs = convertStubsToRecord(stubs);
    return Object.fromEntries(Object.entries(normalizedStubs)
        .filter(([key, value]) => isDirectiveKey(key) && value !== false)
        .map(([key, value]) => [key.substring(1), value]));
}
export function hasSetupState(vm) {
    return (vm &&
        vm.$.devtoolsRawSetupState);
}
export function isScriptSetup(vm) {
    return (vm && vm.$.setupState.__isScriptSetup);
}
