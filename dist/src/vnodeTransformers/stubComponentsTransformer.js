import { isKeepAlive, isRootComponent, isTeleport } from './util';
import { Transition, TransitionGroup, BaseTransition, h, defineComponent } from 'vue';
import { hyphenate } from '../utils/vueShared';
import { matchName } from '../utils/matchName';
import { isComponent, isFunctionalComponent } from '../utils';
import { unwrapLegacyVueExtendComponent } from '../utils/vueCompatSupport';
import { getComponentName, getComponentRegisteredName } from '../utils/componentName';
import { config } from '../config';
import { registerStub } from '../stubs';
const normalizeStubProps = (props) => {
    // props are always normalized to object syntax
    const $props = props;
    return Object.keys($props).reduce((acc, key) => {
        var _a;
        if (typeof $props[key] === 'symbol') {
            return Object.assign(Object.assign({}, acc), { [key]: (_a = $props[key]) === null || _a === void 0 ? void 0 : _a.toString() });
        }
        if (typeof $props[key] === 'function') {
            return Object.assign(Object.assign({}, acc), { [key]: '[Function]' });
        }
        return Object.assign(Object.assign({}, acc), { [key]: $props[key] });
    }, {});
};
export const createStub = ({ name, type, renderStubDefaultSlot }) => {
    const anonName = 'anonymous-stub';
    const tag = name ? `${hyphenate(name)}-stub` : anonName;
    const componentOptions = type
        ? unwrapLegacyVueExtendComponent(type) || {}
        : {};
    const stub = defineComponent({
        name: name || anonName,
        props: componentOptions.props || {},
        // fix #1550 - respect old-style v-model for shallow mounted components with @vue/compat
        // @ts-expect-error
        model: componentOptions.model,
        setup(props, { slots }) {
            return () => {
                // https://github.com/vuejs/test-utils/issues/1076
                // Passing a symbol as a static prop is not legal, since Vue will try to do
                // something like `el.setAttribute('val', Symbol())` which is not valid and
                // causes an error.
                // Only a problem when shallow mounting. For this reason we iterate of the
                // props that will be passed and stringify any that are symbols.
                // Also having function text as attribute is useless and annoying so
                // we replace it with "[Function]""
                const stubProps = normalizeStubProps(props);
                return h(tag, stubProps, renderStubDefaultSlot ? slots : undefined);
            };
        }
    });
    const { __asyncLoader: asyncLoader } = type;
    if (asyncLoader) {
        asyncLoader().then(() => {
            registerStub({
                source: type.__asyncResolved,
                stub
            });
        });
    }
    return stub;
};
const resolveComponentStubByName = (componentName, stubs) => {
    for (const [stubKey, value] of Object.entries(stubs)) {
        if (matchName(componentName, stubKey)) {
            return value;
        }
    }
};
export function createStubComponentsTransformer({ rootComponents, stubs = {}, shallow = false, renderStubDefaultSlot = false }) {
    return function componentsTransformer(type, instance) {
        var _a, _b, _c;
        // stub teleport by default via config.global.stubs
        if (isTeleport(type) && ('teleport' in stubs || 'Teleport' in stubs)) {
            if ('teleport' in stubs && stubs['teleport'] === false)
                return type;
            if ('Teleport' in stubs && stubs['Teleport'] === false)
                return type;
            return createStub({
                name: 'teleport',
                type,
                renderStubDefaultSlot: true
            });
        }
        // stub keep-alive/KeepAlive by default via config.global.stubs
        if (isKeepAlive(type) && ('keep-alive' in stubs || 'KeepAlive' in stubs)) {
            if ('keep-alive' in stubs && stubs['keep-alive'] === false)
                return type;
            if ('KeepAlive' in stubs && stubs['KeepAlive'] === false)
                return type;
            return createStub({
                name: 'keep-alive',
                type,
                renderStubDefaultSlot: true
            });
        }
        // stub transition by default via config.global.stubs
        if ((type === Transition || type === BaseTransition) &&
            ('transition' in stubs || 'Transition' in stubs)) {
            if ('transition' in stubs && stubs['transition'] === false)
                return type;
            if ('Transition' in stubs && stubs['Transition'] === false)
                return type;
            return createStub({
                name: 'transition',
                type,
                renderStubDefaultSlot: true
            });
        }
        // stub transition-group by default via config.global.stubs
        if (type === TransitionGroup &&
            ('transition-group' in stubs || 'TransitionGroup' in stubs)) {
            if ('transition-group' in stubs && stubs['transition-group'] === false)
                return type;
            if ('TransitionGroup' in stubs && stubs['TransitionGroup'] === false)
                return type;
            return createStub({
                name: 'transition-group',
                type,
                renderStubDefaultSlot: true
            });
        }
        // Don't stub root components
        if (isRootComponent(rootComponents, type, instance)) {
            return type;
        }
        const registeredName = getComponentRegisteredName(instance, type);
        const componentName = getComponentName(instance, type);
        let stub = null;
        let name = null;
        // Prio 1 using the key in locally registered components in the parent
        if (registeredName) {
            stub = resolveComponentStubByName(registeredName, stubs);
            if (stub) {
                name = registeredName;
            }
        }
        // Prio 2 using the name attribute in the component
        if (!stub && componentName) {
            stub = resolveComponentStubByName(componentName, stubs);
            if (stub) {
                name = componentName;
            }
        }
        // case 2: custom implementation
        if (isComponent(stub)) {
            const unwrappedStub = unwrapLegacyVueExtendComponent(stub);
            const stubFn = isFunctionalComponent(unwrappedStub) ? unwrappedStub : null;
            // Edge case: stub is component, we will not render stub but instead will create
            // a new "copy" of stub component definition, but we want user still to be able
            // to find our component by stub definition, so we register it manually
            registerStub({ source: type, stub });
            const specializedStubComponent = stubFn
                ? (...args) => stubFn(...args)
                : Object.assign({}, unwrappedStub);
            specializedStubComponent.props = unwrappedStub.props;
            return specializedStubComponent;
        }
        if (stub === false) {
            // we explicitly opt out of stubbing this component
            return type;
        }
        // we return a stub by matching Vue's `h` function
        // where the signature is h(Component, props, slots)
        // case 1: default stub
        if (stub === true || shallow) {
            // Set name when using shallow without stub
            const stubName = name || registeredName || componentName;
            return ((_c = (_b = (_a = config.plugins).createStubs) === null || _b === void 0 ? void 0 : _b.call(_a, {
                name: stubName,
                component: type,
                registerStub
            })) !== null && _c !== void 0 ? _c : createStub({
                name: stubName,
                type,
                renderStubDefaultSlot
            }));
        }
        return type;
    };
}
