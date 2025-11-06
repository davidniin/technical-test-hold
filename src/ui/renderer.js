import { selectElement, showElement, hideElement } from '../utils/dom.js';
import { listRow, gridRow } from './templates.js';

const docListEl = selectElement('#doc-list');
const listHeaderEl = selectElement('#container-header-documents'); 

export function render(appState, options = {}) {
    if (!docListEl) return;
    const { view } = options;
    const documents = Array.isArray(appState?.documents) ? appState.documents : [];

    docListEl.classList.toggle('list-view', view === 'list');
    docListEl.classList.toggle('grid-view', view === 'grid');

    if (listHeaderEl) {
        view === 'list' ? showElement(listHeaderEl) : hideElement(listHeaderEl);
    }

    docListEl.innerHTML = view === 'list' ? documents.map(listRow).join('') : documents.map(gridRow).join('');
}
