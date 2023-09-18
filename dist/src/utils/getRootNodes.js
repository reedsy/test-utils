import { isNotNullOrUndefined } from '../utils';
export function getRootNodes(vnode) {
    if (vnode.shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        return [vnode.el];
    }
    else if (vnode.shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
        const { subTree } = vnode.component;
        return getRootNodes(subTree);
    }
    else if (vnode.shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
        return getRootNodes(vnode.suspense.activeBranch);
    }
    else if (vnode.shapeFlag &
        (8 /* ShapeFlags.TEXT_CHILDREN */ | 64 /* ShapeFlags.TELEPORT */)) {
        // static node optimization, subTree.children will be static string and will not help us
        const result = [vnode.el];
        if (vnode.anchor) {
            let currentNode = result[0].nextSibling;
            while (currentNode && currentNode.previousSibling !== vnode.anchor) {
                result.push(currentNode);
                currentNode = currentNode.nextSibling;
            }
        }
        return result;
    }
    else if (vnode.shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
        const children = vnode.children.flat();
        return children
            .flatMap((vnode) => getRootNodes(vnode))
            .filter(isNotNullOrUndefined);
    }
    // Missing cases which do not need special handling:
    // ShapeFlags.SLOTS_CHILDREN comes with ShapeFlags.ELEMENT
    // Will hit this default when ShapeFlags is 0
    // This is the case for example for unresolved async component without loader
    return [];
}
