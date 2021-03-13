export function cloneTemplate(node) {
    return node.content.firstElementChild.cloneNode(true);
}