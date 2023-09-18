/*!
 * isElementVisible
 * Adapted from https://github.com/testing-library/jest-dom
 * Licensed under the MIT License.
 */
function isStyleVisible(element) {
    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
        return false;
    }
    const { display, visibility, opacity } = getComputedStyle(element);
    return (display !== 'none' &&
        visibility !== 'hidden' &&
        visibility !== 'collapse' &&
        opacity !== '0');
}
function isAttributeVisible(element) {
    return (!element.hasAttribute('hidden') &&
        (element.nodeName === 'DETAILS' ? element.hasAttribute('open') : true));
}
export function isElementVisible(element) {
    return (element.nodeName !== '#comment' &&
        isStyleVisible(element) &&
        isAttributeVisible(element) &&
        (!element.parentElement || isElementVisible(element.parentElement)));
}
