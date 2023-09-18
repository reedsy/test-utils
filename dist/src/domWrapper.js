var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from './config';
import BaseWrapper from './baseWrapper';
import { createDOMWrapper, registerFactory, WrapperType } from './wrapperFactory';
import { isRefSelector } from './utils';
import { createWrapperError } from './errorWrapper';
export class DOMWrapper extends BaseWrapper {
    constructor(element) {
        if (!element) {
            return createWrapperError('DOMWrapper');
        }
        super(element);
        // plugins hook
        config.plugins.DOMWrapper.extend(this);
    }
    getRootNodes() {
        return [this.wrapperElement];
    }
    getCurrentComponent() {
        var _a;
        let component = this.element.__vueParentComponent;
        while (((_a = component === null || component === void 0 ? void 0 : component.parent) === null || _a === void 0 ? void 0 : _a.vnode.el) === this.element) {
            component = component.parent;
        }
        return component;
    }
    find(selector) {
        const result = super.find(selector);
        if (result.exists() && isRefSelector(selector)) {
            return this.element.contains(result.element)
                ? result
                : createWrapperError('DOMWrapper');
        }
        return result;
    }
    findAll(selector) {
        if (!(this.wrapperElement instanceof Element)) {
            return [];
        }
        return Array.from(this.wrapperElement.querySelectorAll(selector), createDOMWrapper);
    }
    findAllComponents(selector) {
        const results = super.findAllComponents(selector);
        return results.filter((r) => this.element.contains(r.element));
    }
    setChecked(checked = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // typecast so we get type safety
            const element = this.element;
            const type = this.attributes().type;
            if (type === 'radio' && !checked) {
                throw Error(`wrapper.setChecked() cannot be called with parameter false on a '<input type="radio" /> element.`);
            }
            // we do not want to trigger an event if the user
            // attempting set the same value twice
            // this is because in a browser setting checked = true when it is
            // already true is a no-op; no change event is triggered
            if (checked === element.checked) {
                return;
            }
            element.checked = checked;
            this.trigger('input');
            return this.trigger('change');
        });
    }
    setValue(value) {
        const element = this.element;
        const tagName = element.tagName;
        const type = this.attributes().type;
        if (tagName === 'OPTION') {
            this.setSelected();
            return Promise.resolve();
        }
        else if (tagName === 'INPUT' && type === 'checkbox') {
            return this.setChecked(value);
        }
        else if (tagName === 'INPUT' && type === 'radio') {
            return this.setChecked(value);
        }
        else if (tagName === 'SELECT') {
            if (Array.isArray(value)) {
                const selectElement = element;
                for (let i = 0; i < selectElement.options.length; i++) {
                    const option = selectElement.options[i];
                    option.selected = value.includes(option.value);
                }
            }
            else {
                element.value = value;
            }
            this.trigger('input');
            return this.trigger('change');
        }
        else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
            element.value = value;
            this.trigger('input');
            // trigger `change` for `v-model.lazy`
            return this.trigger('change');
        }
        else {
            throw Error(`wrapper.setValue() cannot be called on ${tagName}`);
        }
    }
    setSelected() {
        const element = this.element;
        if (element.selected) {
            return;
        }
        // todo - review all non-null assertion operators in project
        // search globally for `!.` and with regex `!$`
        element.selected = true;
        let parentElement = element.parentElement;
        if (parentElement.tagName === 'OPTGROUP') {
            parentElement = parentElement.parentElement;
        }
        const parentWrapper = new DOMWrapper(parentElement);
        parentWrapper.trigger('input');
        return parentWrapper.trigger('change');
    }
}
registerFactory(WrapperType.DOMWrapper, (element) => new DOMWrapper(element));
