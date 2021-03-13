import { load } from './load.js';

// Data stuff, should be turned into an AJAX call for JSON
// import { data } from './data/data.js';

document.addEventListener("DOMContentLoaded", function () {
    load();
});

// This should be moved elsewhere
export function cloneTemplate(node) {
    return node.content.firstElementChild.cloneNode(true);
}
