var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { textContent } from './utils';
import { nextTick } from 'vue';
import { createDOMEvent } from './createDomEvent';
import { find, matches } from './utils/find';
import { createWrapperError } from './errorWrapper';
import { isElementVisible } from './utils/isElementVisible';
import { isElement } from './utils/isElement';
import { createDOMWrapper, createVueWrapper } from './wrapperFactory';
import { stringifyNode } from './utils/stringifyNode';
import beautify from 'js-beautify';
export default class BaseWrapper {
    get element() {
        return this.wrapperElement;
    }
    constructor(element) {
        this.isDisabled = () => {
            const validTagsToBeDisabled = [
                'BUTTON',
                'COMMAND',
                'FIELDSET',
                'KEYGEN',
                'OPTGROUP',
                'OPTION',
                'SELECT',
                'TEXTAREA',
                'INPUT'
            ];
            const hasDisabledAttribute = this.attributes().disabled !== undefined;
            const elementCanBeDisabled = isElement(this.element) &&
                validTagsToBeDisabled.includes(this.element.tagName);
            return hasDisabledAttribute && elementCanBeDisabled;
        };
        this.wrapperElement = element;
    }
    findAllDOMElements(selector) {
        const elementRootNodes = this.getRootNodes().filter(isElement);
        if (elementRootNodes.length === 0)
            return [];
        const result = [
            ...elementRootNodes.filter((node) => node.matches(selector))
        ];
        elementRootNodes.forEach((rootNode) => {
            result.push(...Array.from(rootNode.querySelectorAll(selector)));
        });
        return result;
    }
    find(selector) {
        if (typeof selector === 'object' && 'ref' in selector) {
            const currentComponent = this.getCurrentComponent();
            if (!currentComponent) {
                return createWrapperError('DOMWrapper');
            }
            let result = currentComponent.refs[selector.ref];
            // When using ref inside v-for, then refs contains array of component instances and nodes
            if (Array.isArray(result)) {
                result = result.length ? result[0] : undefined;
            }
            if (result instanceof Node) {
                return createDOMWrapper(result);
            }
            else {
                return createWrapperError('DOMWrapper');
            }
        }
        const elements = this.findAll(selector);
        if (elements.length > 0) {
            return elements[0];
        }
        return createWrapperError('DOMWrapper');
    }
    findComponent(selector) {
        const currentComponent = this.getCurrentComponent();
        if (!currentComponent) {
            return createWrapperError('VueWrapper');
        }
        if (typeof selector === 'object' && 'ref' in selector) {
            let result = currentComponent.refs[selector.ref];
            // When using ref inside v-for, then refs contains array of component instances
            if (Array.isArray(result)) {
                result = result.length ? result[0] : undefined;
            }
            if (result && !(result instanceof HTMLElement)) {
                return createVueWrapper(null, result);
            }
            else {
                return createWrapperError('VueWrapper');
            }
        }
        if (matches(currentComponent.vnode, selector) &&
            this.element.contains(currentComponent.vnode.el)) {
            return createVueWrapper(null, currentComponent.proxy);
        }
        const [result] = this.findAllComponents(selector);
        return result !== null && result !== void 0 ? result : createWrapperError('VueWrapper');
    }
    findAllComponents(selector) {
        const currentComponent = this.getCurrentComponent();
        if (!currentComponent) {
            return [];
        }
        let results = find(currentComponent.subTree, selector);
        return results.map((c) => c.proxy
            ? createVueWrapper(null, c.proxy)
            : createDOMWrapper(c.vnode.el));
    }
    html(options) {
        const stringNodes = this.getRootNodes().map((node) => stringifyNode(node));
        if (options === null || options === void 0 ? void 0 : options.raw)
            return stringNodes.join('');
        return stringNodes
            .map((node) => beautify.html(node, {
            unformatted: ['code', 'pre', 'em', 'strong', 'span'],
            indent_inner_html: true,
            indent_size: 2,
            inline_custom_elements: false
            // TODO the cast can be removed when @types/js-beautify will be up-to-date
        }))
            .join('\n');
    }
    classes(className) {
        const classes = isElement(this.element)
            ? Array.from(this.element.classList)
            : [];
        if (className)
            return classes.includes(className);
        return classes;
    }
    attributes(key) {
        const attributeMap = {};
        if (isElement(this.element)) {
            const attributes = Array.from(this.element.attributes);
            for (const attribute of attributes) {
                attributeMap[attribute.localName] = attribute.value;
            }
        }
        return key ? attributeMap[key] : attributeMap;
    }
    text() {
        return textContent(this.element);
    }
    exists() {
        return true;
    }
    get(selector) {
        const result = this.find(selector);
        if (result.exists()) {
            return result;
        }
        throw new Error(`Unable to get ${selector} within: ${this.html()}`);
    }
    getComponent(selector) {
        const result = this.findComponent(selector);
        if (result.exists()) {
            return result;
        }
        let message = 'Unable to get ';
        if (typeof selector === 'string') {
            message += `component with selector ${selector}`;
        }
        else if ('name' in selector) {
            message += `component with name ${selector.name}`;
        }
        else if ('ref' in selector) {
            message += `component with ref ${selector.ref}`;
        }
        else {
            message += 'specified component';
        }
        message += ` within: ${this.html()}`;
        throw new Error(message);
    }
    isVisible() {
        return isElement(this.element) && isElementVisible(this.element);
    }
    trigger(eventString, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options && options['target']) {
                throw Error(`[vue-test-utils]: you cannot set the target value of an event. See the notes section ` +
                    `of the docs for more details—` +
                    `https://vue-test-utils.vuejs.org/api/wrapper/trigger.html`);
            }
            if (this.element && !this.isDisabled()) {
                const event = createDOMEvent(eventString, options);
                // see https://github.com/vuejs/test-utils/issues/1854
                // fakeTimers provoke an issue as Date.now() always return the same value
                // and Vue relies on it to determine if the handler should be invoked
                // see https://github.com/vuejs/core/blob/5ee40532a63e0b792e0c1eccf3cf68546a4e23e9/packages/runtime-dom/src/modules/events.ts#L100-L104
                // we workaround this issue by manually setting _vts to Date.now() + 1
                // thus making sure the event handler is invoked
                event._vts = Date.now() + 1;
                this.element.dispatchEvent(event);
            }
            return nextTick();
        });
    }
}
