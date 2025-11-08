
import { selectElement, onEvent } from './utils/dom.js';
import { Store } from './store.js';
import { render } from './ui/renderer.js';
import { getAllDocuments } from './api.js';

const viewOptions = { view: 'list', sort: 'createdAt:desc' };

Store.subscribe((state) => render(state, viewOptions));

const btnList = selectElement('#btn-list');
const btnGrid = selectElement('#btn-grid');
const sortSel = selectElement('#sort-select');
const buttonForNewDoc = selectElement('#link-add');
const containerModal = selectElement('#new-modal-for-new-doc');
const formDocument = selectElement('#form-new-document');
const toastsBox = selectElement('#notifications');

onEvent(btnList, 'click', () => {
    viewOptions.view = 'list';
    btnList?.setAttribute('aria-pressed', 'true');
    btnGrid?.setAttribute('aria-pressed', 'false');
    render(Store.getState(), viewOptions);
});

onEvent(btnGrid, 'click', () => {
    viewOptions.view = 'grid';
    btnList?.setAttribute('aria-pressed', 'false');
    btnGrid?.setAttribute('aria-pressed', 'true');
    render(Store.getState(), viewOptions);
});

onEvent(sortSel, 'change', () => {
    viewOptions.sort = sortSel.value;
    render(Store.getState(), viewOptions);
});

onEvent(buttonForNewDoc, 'click', () => {
    try { containerModal.showModal(); } catch { }
});

onEvent(formDocument, 'submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formDocument);

    const parseList = (value) => String(value ?? '').split(',').map(s => s.trim()).filter(Boolean);

    const nameValue = String(formData.get('name') ?? '').trim();
    const versionValue = Number(formData.get('version'));
    const contributorsList = parseList(formData.get('contributors'));
    const attachmentsList = parseList(formData.get('attachments'));

    if (!nameValue) {
        toast('Name is required');
        return;
    }
    if (!versionValue || isNaN(versionValue)) {
        toast('Version is required and must be a number');
        return;
    }

    const newDocument = {
        id: crypto.randomUUID(),
        name: nameValue,
        version: versionValue,
        contributors: contributorsList,
        attachments: attachmentsList,
        createdAt: new Date().toISOString()
    };

    Store.addDocument(newDocument);
    toast('New document added');
    formDocument.reset();
    try { containerModal.close(); } catch { }
});

const inizializeApp = async () => {
    try {
        const documents = await getAllDocuments();
        Store.setDocuments(documents);
    } catch (err) {
        Store.setDocuments([]);
        toast('No se pudieron cargar documentos (puedes crear locales).');
        console.warn(err);
    }
};

const toast = (textToAddInToast) => {
    if (!toastsBox) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = textToAddInToast;
    toastsBox.appendChild(el);
    setTimeout(() => el.remove(), 280000);
}

void (async () => {
    await inizializeApp();
})();