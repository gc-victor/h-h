import { patchTrees } from './patch-trees.js';

export function patch(a, b) {
    const parentNode = a.parentNode;
    let activeElement = document.activeElement;
    if (activeElement && activeElement.tagName !== 'BODY' && a.contains(activeElement)) {
        const { p, n, pAncestry, nActiveElement, nAncestry } = doubleTree(a, b, activeElement);
        if (!nActiveElement) {
            parentNode.replaceChild(b, a);
        } else {
            patchTrees(n, p, pAncestry, nAncestry);
            return a;
        }
    } else {
        parentNode.replaceChild(b, a);
    }

    return b;
}

export function doubleTree(a, b, activeElement) {
    const p = tree(a);
    const n = tree(b);
    const pAncestry = ancestry(p[0], activeElement);
    const nActiveElement = n.find((i) => {
        const pKey = activeElement.__key__;
        const iKey = i.__key__;
        const pName = activeElement.getAttribute('name');
        const iName = i.getAttribute('name');
        return (
            (pKey && iKey && pKey === iKey) ||
            (pName && iName && pName === iName) ||
            (!pKey && activeElement.isEqualNode(i))
        );
    });
    const nAncestry = nActiveElement && ancestry(n[0], nActiveElement);
    return { p, n, pAncestry, nActiveElement, nAncestry };

    function tree(root) {
        let treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        let nodeList = [];
        let currentNode = treeWalker.currentNode;
        while (currentNode) {
            nodeList.push(currentNode);
            currentNode = treeWalker.nextNode();
        }
        return nodeList;
    }

    function ancestry(parentNode, cur) {
        const ancestry = [];
        while (cur && cur !== parentNode) {
            const n = cur;
            ancestry.push(n);
            cur = n.parentNode;
        }
        ancestry.push(parentNode);
        return ancestry;
    }
}
