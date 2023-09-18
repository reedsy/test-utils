import * as Vue from 'vue';
import { hasOwnProperty } from '../utils';
function isCompatEnabled(key) {
    var _a, _b;
    return (_b = (_a = Vue.compatUtils) === null || _a === void 0 ? void 0 : _a.isCompatEnabled(key)) !== null && _b !== void 0 ? _b : false;
}
export function isLegacyExtendedComponent(component) {
    if (!isCompatEnabled('GLOBAL_EXTEND') || typeof component !== 'function') {
        return false;
    }
    return (hasOwnProperty(component, 'super') &&
        component.super.extend({}).super === component.super);
}
export function unwrapLegacyVueExtendComponent(selector) {
    return isLegacyExtendedComponent(selector) ? selector.options : selector;
}
export function isLegacyFunctionalComponent(component) {
    return Boolean(component &&
        typeof component === 'object' &&
        hasOwnProperty(component, 'functional') &&
        component.functional);
}
