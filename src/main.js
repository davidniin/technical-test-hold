
import { documentService } from './services/DocumentService.js';
import './components/DocumentList.js';
import './components/DocumentForm.js';
import { selectElement, onEvent } from './utils/dom.js';

// Toast Logic (Global for now, could be a component)
const toastsBox = selectElement('#notifications');
const showToast = (text) => {
    if (!toastsBox) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    toastsBox.appendChild(el);
    setTimeout(() => el.remove(), 2000);
};

window.addEventListener('show-toast', (e) => showToast(e.detail));
window.addEventListener('document-created', (e) => showToast(`New document added: ${e.detail.name}`));

// App Initialization
const init = async () => {
    console.log('App initializing...');
    // Wait for components to be defined
    await Promise.all([
        customElements.whenDefined('document-list'),
        customElements.whenDefined('document-form')
    ]);

    // UI Controls
    const btnList = selectElement('#btn-list');
    const btnGrid = selectElement('#btn-grid');
    const sortSel = selectElement('#sort-select');
    const buttonForNewDoc = selectElement('#link-add');
    const containerModal = selectElement('#new-modal-for-new-doc');
    const docList = document.querySelector('document-list'); // Use querySelector for custom element

    // Event Listeners for Controls
    if (docList) {
        onEvent(btnList, 'click', () => {
            docList.setView('list');
            btnList?.setAttribute('aria-pressed', 'true');
            btnGrid?.setAttribute('aria-pressed', 'false');
        });

        onEvent(btnGrid, 'click', () => {
            docList.setView('grid');
            btnList?.setAttribute('aria-pressed', 'false');
            btnGrid?.setAttribute('aria-pressed', 'true');
        });

        onEvent(sortSel, 'change', () => {
            docList.setSort(sortSel.value);
        });
    } else {
        console.error('Document List component not found in DOM');
    }

    onEvent(buttonForNewDoc, 'click', () => {
        try { containerModal.showModal(); } catch { }
    });

    // Initialize Service
    await documentService.init();
};

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    documentService.dispose();
});

// Start
init();
