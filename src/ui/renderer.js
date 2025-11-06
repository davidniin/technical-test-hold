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

    docListEl.innerHTML = view === 'list' ? documentsSortedList.map(listRow).join('') : documentsSortedList.map(gridRow).join('');
}
