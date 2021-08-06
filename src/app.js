export const app = (oldChild, newChild) => {
    oldChild.parentNode.replaceChild(newChild, oldChild);
};
