import { isFunctionalComponent, isObjectComponent } from '../utils';
import { isLegacyExtendedComponent, unwrapLegacyVueExtendComponent } from './vueCompatSupport';
const getComponentNameInSetup = (instance, type) => Object.keys((instance === null || instance === void 0 ? void 0 : instance.setupState) || {}).find((key) => { var _a; return ((_a = Object.getOwnPropertyDescriptor(instance.setupState, key)) === null || _a === void 0 ? void 0 : _a.value) === type; });
export const getComponentRegisteredName = (instance, type) => {
    if (!instance || !instance.parent)
        return null;
    // try to infer the name based on local resolution
    const registry = instance.type.components;
    for (const key in registry) {
        if (registry[key] === type) {
            return key;
        }
    }
    // try to retrieve name imported in script setup
    return getComponentNameInSetup(instance.parent, type) || null;
};
export const getComponentName = (instance, type) => {
    if (isObjectComponent(type)) {
        return (
        // If the component we stub is a script setup component and is automatically
        // imported by unplugin-vue-components we can only get its name through
        // the `__name` property.
        getComponentNameInSetup(instance, type) || type.name || type.__name || '');
    }
    if (isLegacyExtendedComponent(type)) {
        return unwrapLegacyVueExtendComponent(type).name || '';
    }
    if (isFunctionalComponent(type)) {
        return type.displayName || type.name;
    }
    return '';
};
