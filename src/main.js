
import { selectElement, onEvent} from './utils/dom.js';
import { Store } from './store.js';
import { render } from './ui/renderer.js';
import { getAllDocuments } from './api.js';

const viewOptions = { view: 'list' };

Store.subscribe((state) => render(state, viewOptions));

const btnList = selectElement('#btn-list');
const btnGrid = selectElement('#btn-grid');

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

function toast(text) {
    if (!toastsBox) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    toastsBox.appendChild(el);
    setTimeout(() => el.remove(), 2800);
}

void (async () => {
  await inizializeApp();
})();