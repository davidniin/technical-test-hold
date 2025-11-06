import { listRow } from './templates.js';

const docListEl = document.querySelector('#doc-list');

export function render(appState, options = {}) {
    const { view } = options;
    const documents = Array.isArray(appState?.documents) ? appState.documents : [];

    docListEl.classList.toggle('list-view', view === 'list');
    docListEl.innerHTML = documents.map(listRow).join('');
}
