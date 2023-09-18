export var WrapperType;
(function (WrapperType) {
    WrapperType[WrapperType["DOMWrapper"] = 0] = "DOMWrapper";
    WrapperType[WrapperType["VueWrapper"] = 1] = "VueWrapper";
})(WrapperType || (WrapperType = {}));
const factories = {};
export function registerFactory(type, fn) {
    factories[type] = fn;
}
export const createDOMWrapper = (element) => factories[WrapperType.DOMWrapper](element);
export const createVueWrapper = (app, vm, setProps) => factories[WrapperType.VueWrapper](app, vm, setProps);
