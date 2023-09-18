export function stringifyNode(node) {
    return node instanceof Element
        ? node.outerHTML
        : new XMLSerializer().serializeToString(node);
}
