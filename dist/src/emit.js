import { setDevtoolsHook } from 'vue';
let events = {};
export function emitted(vm, eventName) {
    const cid = vm.$.uid;
    const vmEvents = events[cid] || {};
    if (eventName) {
        return vmEvents ? vmEvents[eventName] : undefined;
    }
    return vmEvents;
}
export const attachEmitListener = () => {
    // use devtools to capture this "emit"
    setDevtoolsHook(createDevTools(), {});
};
// devtools hook only catches Vue component custom events
function createDevTools() {
    return {
        emit(eventType, ...payload) {
            if (eventType !== "component:emit" /* DevtoolsHooks.COMPONENT_EMIT */)
                return;
            const [_, componentVM, event, eventArgs] = payload;
            recordEvent(componentVM, event, eventArgs);
        }
    };
}
export const recordEvent = (vm, event, args) => {
    // Functional component wrapper creates a parent component
    let wrapperVm = vm;
    while (typeof (wrapperVm === null || wrapperVm === void 0 ? void 0 : wrapperVm.type) === 'function')
        wrapperVm = wrapperVm.parent;
    const cid = wrapperVm.uid;
    if (!(cid in events)) {
        events[cid] = {};
    }
    if (!(event in events[cid])) {
        events[cid][event] = [];
    }
    // Record the event message sent by the emit
    events[cid][event].push(args);
};
export const removeEventHistory = (vm) => {
    const cid = vm.$.uid;
    delete events[cid];
};
