import { selectElement, showElement, hideElement } from '../utils/dom.js';
import { sortDocuments } from '../sorting.js';
import { listRow, gridRow } from './templates.js';

const docListEl = selectElement('#doc-list');
const listHeaderEl = selectElement('#container-header-documents');

export function render(appState, options = {}) {
    if (!docListEl) return;
    const { view, sort } = options;
    const documentsList = Array.isArray(appState?.documents) ? appState.documents : [];

    const documentsSortedList = sortDocuments(documentsList, sort);

    docListEl.classList.toggle('list-view', view === 'list');
    docListEl.classList.toggle('grid-view', view === 'grid');

    if (listHeaderEl) {
        view === 'list' ? showElement(listHeaderEl) : hideElement(listHeaderEl);
    }

    // Incremental reconciliation
    const existingNodes = new Map();
    Array.from(docListEl.children).forEach(child => {
        if (child.id) existingNodes.set(child.id, child);
    });

    const fragment = document.createDocumentFragment();

    documentsSortedList.forEach(doc => {
        const html = view === 'list' ? listRow(doc) : gridRow(doc);

        // Create temp node to parse HTML string
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const newEl = temp.firstElementChild;

        if (!newEl) return;

        const docId = newEl.id; // Assume template puts ID on root element
        const existingEl = existingNodes.get(docId);

        if (existingEl) {
            // Update content if changed
            if (existingEl.innerHTML !== newEl.innerHTML) {
                existingEl.innerHTML = newEl.innerHTML;
                existingEl.className = newEl.className;
            }
            fragment.appendChild(existingEl); // Move to new position
            existingNodes.delete(docId);
        } else {
            fragment.appendChild(newEl);
        }
    });

    // Remove deleted nodes
    existingNodes.forEach(node => node.remove());

    // Append sorted/updated nodes
    docListEl.appendChild(fragment);
}
