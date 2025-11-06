
import { Store } from './store.js';
import { render } from './ui/renderer.js';
import { getAllDocuments } from './api.js';

const viewOptions = { view: 'list' };

Store.subscribe((state) => render(state, viewOptions));

const listViewBtn = document.querySelector('#btn-list');
if (listViewBtn) {
  listViewBtn.addEventListener('click', () => {
    viewOptions.view = 'list';
    listViewBtn.setAttribute('aria-pressed', 'true');
    render(Store.getState(), viewOptions);
  });
}

const inizializeApp = async () => {
  try {
    const documents = await getAllDocuments();
    Store.setDocuments(documents);
  } catch (err) {
    Store.setDocuments([]);
    console.warn(err);
  }
};

void (async () => {
  await inizializeApp();
})();