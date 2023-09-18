import { isComponent } from '../utils';
import { registerStub } from '../stubs';
export const isTeleport = (type) => type.__isTeleport;
export const isKeepAlive = (type) => type.__isKeepAlive;
export const isRootComponent = (rootComponents, type, instance) => !!(!instance ||
    // Don't stub mounted component on root level
    (rootComponents.component === type && !(instance === null || instance === void 0 ? void 0 : instance.parent)) ||
    // Don't stub component with compat wrapper
    (rootComponents.functional && rootComponents.functional === type));
export const createVNodeTransformer = ({ rootComponents, transformers }) => {
    const transformationCache = new WeakMap();
    return (args, instance) => {
        const [originalType, props, children, ...restVNodeArgs] = args;
        if (!isComponent(originalType)) {
            return [originalType, props, children, ...restVNodeArgs];
        }
        const componentType = originalType;
        const cachedTransformation = transformationCache.get(originalType);
        if (cachedTransformation &&
            // Don't use cache for root component, as it could use stubbed recursive component
            !isRootComponent(rootComponents, componentType, instance) &&
            !isTeleport(originalType) &&
            !isKeepAlive(originalType)) {
            return [cachedTransformation, props, children, ...restVNodeArgs];
        }
        const transformedType = transformers.reduce((type, transformer) => transformer(type, instance), componentType);
        if (originalType !== transformedType) {
            transformationCache.set(originalType, transformedType);
            registerStub({ source: originalType, stub: transformedType });
            // https://github.com/vuejs/test-utils/issues/1829 & https://github.com/vuejs/test-utils/issues/1888
            // Teleport/KeepAlive should return child nodes as a function
            if (isTeleport(originalType) || isKeepAlive(originalType)) {
                return [transformedType, props, () => children, ...restVNodeArgs];
            }
        }
        return [transformedType, props, children, ...restVNodeArgs];
    };
};
