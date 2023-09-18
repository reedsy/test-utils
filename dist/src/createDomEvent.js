import domEvents, { ignorableKeyModifiers, systemKeyModifiers, mouseKeyModifiers, keyCodesByKeyName } from './constants/dom-events';
/**
 * Groups modifiers into lists
 */
function generateModifiers(modifiers, isOnClick) {
    const keyModifiers = [];
    const systemModifiers = [];
    for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i];
        // addEventListener() options, e.g. .passive & .capture, that we dont need to handle
        if (ignorableKeyModifiers.includes(modifier)) {
            continue;
        }
        // modifiers that require special conversion
        // if passed a left/right key modifier with onClick, add it here as well.
        if (systemKeyModifiers.includes(modifier) ||
            (mouseKeyModifiers.includes(modifier) &&
                isOnClick)) {
            systemModifiers.push(modifier);
        }
        else {
            keyModifiers.push(modifier);
        }
    }
    return {
        keyModifiers,
        systemModifiers
    };
}
function getEventProperties(eventParams) {
    let { modifiers, options = {}, eventType } = eventParams;
    let isOnClick = eventType === 'click';
    const { keyModifiers, systemModifiers } = generateModifiers(modifiers, isOnClick);
    if (isOnClick) {
        // if it's a right click, it should fire a `contextmenu` event
        if (systemModifiers.includes('right')) {
            eventType = 'contextmenu';
            options.button = 2;
            // if its a middle click, fire a `mouseup` event
        }
        else if (systemModifiers.includes('middle')) {
            eventType = 'mouseup';
            options.button = 1;
        }
    }
    const meta = domEvents[eventType] || {
        eventInterface: 'Event',
        cancelable: true,
        bubbles: true
    };
    // convert `shift, ctrl` to `shiftKey, ctrlKey`
    // allows trigger('keydown.shift.ctrl.n') directly
    const systemModifiersMeta = systemModifiers.reduce((all, key) => {
        all[`${key}Key`] = true;
        return all;
    }, {});
    // get the keyCode for backwards compat
    const keyCode = keyCodesByKeyName[keyModifiers[0]] ||
        (options && (options.keyCode || options.code));
    const eventProperties = Object.assign(Object.assign(Object.assign(Object.assign({}, systemModifiersMeta), options), { bubbles: meta.bubbles, cancelable: meta.cancelable, 
        // Any derived options should go here
        keyCode, code: keyCode }), (keyModifiers[0] ? { key: keyModifiers[0] } : {}));
    return {
        eventProperties,
        meta,
        eventType
    };
}
function createEvent(eventParams) {
    const { eventProperties, meta, eventType } = getEventProperties(eventParams);
    // user defined eventInterface
    const eventInterface = meta.eventInterface;
    const metaEventInterface = window[eventInterface];
    const SupportedEventInterface = typeof metaEventInterface === 'function' ? metaEventInterface : window.Event;
    return new SupportedEventInterface(eventType, 
    // event properties can only be added when the event is instantiated
    // custom properties must be added after the event has been instantiated
    eventProperties);
}
function createDOMEvent(eventString, options) {
    // split eventString like `keydown.ctrl.shift` into `keydown` and array of modifiers
    const [eventType, ...modifiers] = eventString.split('.');
    const eventParams = {
        eventType: eventType,
        modifiers: modifiers,
        options
    };
    const event = createEvent(eventParams);
    const eventPrototype = Object.getPrototypeOf(event);
    // attach custom options to the event, like `relatedTarget` and so on.
    options &&
        Object.keys(options).forEach((key) => {
            const propertyDescriptor = Object.getOwnPropertyDescriptor(eventPrototype, key);
            const canSetProperty = !(propertyDescriptor && propertyDescriptor.set === undefined);
            if (canSetProperty) {
                event[key] = options[key];
            }
        });
    return event;
}
export { createDOMEvent, keyCodesByKeyName };
