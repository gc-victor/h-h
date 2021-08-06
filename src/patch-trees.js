import { handler } from './handler.js';

// https://github.com/WebReflection/udomdiff/blob/master/esm/index.js
export function patchTrees(n, p, pAncestry, nAncestry) {
    const activeElement = document.activeElement;
    const body = document.body;
    const nLength = n.length;
    let pEnd = p.length;
    let nEnd = nLength;
    let pStart = 0;
    let nStart = 0;
    let added = [];
    let changed = [];

    while (pStart < pEnd || nStart < nEnd) {
        if (pEnd === pStart) {
            while (nStart < nEnd) {
                const nn = n[nStart];
                const nnParent = nn.parentNode;
                const index = nAncestry.indexOf(nnParent);
                if (index !== -1) {
                    pAncestry[index].insertBefore(nn, p[pStart]);
                    added.push(nn);
                }
                nStart++;
            }
        } else if (nEnd === nStart) {
            while (pStart < pEnd) {
                const pp = p[pStart];
                const ppParent = pp.parentNode;
                const isPAncestry = pAncestry.includes(pp);
                if (ppParent && !isPAncestry) {
                    ppParent.removeChild(pp);
                    changed.push(pp);
                }
                pStart++;
            }
        } else if (p[pStart].isEqualNode(n[nStart])) {
            pStart++;
            nStart++;
        } else if (p[pEnd - 1].isEqualNode(n[nEnd - 1])) {
            pEnd--;
            nEnd--;
        } else {
            const pp = p[pStart];
            const nn = n[nStart];
            const ppParent = pp.parentNode;
            const nnParent = nn.parentNode;
            const isParentAdded = added.includes(nnParent);
            const isParentChanged = changed.includes(ppParent);
            const isPAncestry = pAncestry.includes(pp);
            const isNAncestry = nAncestry.includes(nn);
            const isEqualTagNames = pp.tagName === nn.tagName;
            const isPInPage = Boolean(ppParent && ppParent.parentNode);
            if (!isParentAdded || !isParentChanged || (isPAncestry && isNAncestry)) {
                if (
                    !isPAncestry &&
                    !isNAncestry &&
                    isEqualTagNames &&
                    isPInPage &&
                    !added.includes(nnParent.parentNode)
                ) {
                    if (!nAncestry.includes(nnParent) && !pAncestry.includes(ppParent) && !body.contains(nnParent)) {
                        ppParent.parentNode.replaceChild(nnParent, ppParent);
                        added.push(nnParent);
                        added.push(nn);
                        changed.push(ppParent);
                        changed.push(pp);
                    } else if (!body.contains(nn)) {
                        ppParent.replaceChild(nn, pp);
                        added.push(nn);
                        changed.push(pp);
                    }
                    pStart++;
                    nStart++;
                } else if (isPAncestry && isNAncestry && isEqualTagNames) {
                    const ppAttributes = pp.attributes;
                    const nnAttributes = nn.attributes;
                    const ppLength = ppAttributes.length;
                    const nnLength = nnAttributes.length;
                    const nnAttributesKeys = Object.keys(nnAttributes);
                    for (let i = ppLength - 1; i >= 0; i--) {
                        const name = ppAttributes[i].name;
                        if (!nnAttributesKeys.includes(name) && name !== 'type') {
                            pp.removeAttribute(name);
                        }
                    }
                    for (let i = 0; i < nnLength; i++) {
                        const name = nnAttributes[i].name;
                        const value = nnAttributes[i].value;
                        pp.setAttribute(name, value);
                    }
                    if (!pp.__handler__ && nn.__handler__) {
                        const eventTypes = Object.keys(nn.__handler__ || {});
                        const length = eventTypes.length;
                        for (let i = 0; i < length; i++) {
                            nn.removeEventListener(eventTypes[i], handler);
                            pp.addEventListener(eventTypes[i], handler);
                        }
                    }
                    if (
                        pp === activeElement &&
                        !nn.children.length &&
                        nn.childNodes.length &&
                        nn.childNodes[0].nodeType === 3
                    ) {
                        pp.textContent = nn.textContent;
                    }
                    pp.__handler__ = nn.__handler__;
                    added.push(nn);
                    changed.push(pp);
                    pStart++;
                    nStart++;
                } else if (!isPAncestry && isNAncestry) {
                    nStart++;
                } else if (isPAncestry && !isNAncestry) {
                    pStart++;
                } else {
                    pStart++;
                    nStart++;
                }
            } else if (isParentAdded && !isParentChanged) {
                nStart++;
            } else if (!isParentAdded && isParentChanged) {
                pStart++;
            } else {
                if (isPAncestry && !isNAncestry && body.contains(nn)) {
                    nStart++;
                } else if (isPAncestry && !isNAncestry && !body.contains(nn)) {
                    ppParent.insertBefore(nn, pp);
                    added.push(nn);
                    nStart++;
                } else if (!isPAncestry && isNAncestry) {
                    ppParent.removeChild(pp);
                    changed.push(pp);
                    pStart++;
                } else if (!isNAncestry && !isPAncestry && isPInPage) {
                    ppParent.replaceChild(nn, pp);
                    added.push(nn);
                    changed.push(pp);
                    pStart++;
                    nStart++;
                } else {
                    pStart++;
                    nStart++;
                }
            }
        }
    }
}
