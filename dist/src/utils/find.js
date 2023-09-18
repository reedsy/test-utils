import { getOriginalComponentFromStub } from '../stubs';
import { isComponent } from '../utils';
import { matchName } from './matchName';
import { unwrapLegacyVueExtendComponent } from './vueCompatSupport';
import { getComponentName, getComponentRegisteredName } from './componentName';
/**
 * Detect whether a selector matches a VNode
 * @param node
 * @param selector
 * @return {boolean | ((value: any) => boolean)}
 */
export function matches(node, rawSelector) {
    var _a, _b, _c;
    const selector = unwrapLegacyVueExtendComponent(rawSelector);
    // do not return none Vue components
    if (!node.component)
        return false;
    const nodeType = node.type;
    if (!isComponent(nodeType))
        return false;
    if (typeof selector === 'string') {
        return (_b = (_a = node.el) === null || _a === void 0 ? void 0 : _a.matches) === null || _b === void 0 ? void 0 : _b.call(_a, selector);
    }
    // When we're using stubs we want user to be able to
    // find stubbed components both by original component
    // or stub definition. That's why we are trying to
    // extract original component and also stub, which was
    // used to create specialized stub for render
    const nodeTypeCandidates = [
        nodeType,
        getOriginalComponentFromStub(nodeType)
    ].filter(Boolean);
    // our selector might be a stub itself
    const target = (_c = getOriginalComponentFromStub(selector)) !== null && _c !== void 0 ? _c : selector;
    if (nodeTypeCandidates.includes(target)) {
        return true;
    }
    let componentName;
    componentName = getComponentName(node.component, nodeType);
    let selectorName = selector.name;
    // the component and selector both have a name
    if (componentName && selectorName) {
        return matchName(selectorName, componentName);
    }
    componentName =
        getComponentRegisteredName(node.component, nodeType) || undefined;
    // if a name is missing, then check the locally registered components in the parent
    if (node.component.parent) {
        const registry = node.component.parent.type.components;
        for (const key in registry) {
            // is it the selector
            if (!selectorName && registry[key] === selector) {
                selectorName = key;
            }
            // is it the component
            if (!componentName && registry[key] === nodeType) {
                componentName = key;
            }
        }
    }
    if (selectorName && componentName) {
        return matchName(selectorName, componentName);
    }
    return false;
}
/**
 * Filters out the null, undefined and primitive values,
 * to only keep VNode and VNodeArrayChildren values
 * @param value
 */
function nodesAsObject(value) {
    return !!value && typeof value === 'object';
}
/**
 * Collect all children
 * @param nodes
 * @param children
 */
function aggregateChildren(nodes, children) {
    if (children && Array.isArray(children)) {
        const reversedNodes = [...children].reverse().filter(nodesAsObject);
        reversedNodes.forEach((node) => {
            if (Array.isArray(node)) {
                aggregateChildren(nodes, node);
            }
            else {
                nodes.unshift(node);
            }
        });
    }
}
function findAllVNodes(vnode, selector) {
    const matchingNodes = [];
    const nodes = [vnode];
    while (nodes.length) {
        const node = nodes.shift();
        aggregateChildren(nodes, node.children);
        if (node.component) {
            aggregateChildren(nodes, [node.component.subTree]);
        }
        if (node.suspense) {
            // match children if component is Suspense
            const { activeBranch } = node.suspense;
            aggregateChildren(nodes, [activeBranch]);
        }
        if (matches(node, selector) && !matchingNodes.includes(node)) {
            matchingNodes.push(node);
        }
    }
    return matchingNodes;
}
export function find(root, selector) {
    let matchingVNodes = findAllVNodes(root, selector);
    if (typeof selector === 'string') {
        // When searching by CSS selector we want only one (topmost) vnode for each el`
        matchingVNodes = matchingVNodes.filter((vnode) => { var _a; return ((_a = vnode.component.parent) === null || _a === void 0 ? void 0 : _a.vnode.el) !== vnode.el; });
    }
    return matchingVNodes.map((vnode) => vnode.component);
}
