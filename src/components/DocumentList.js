
import { Store } from '../store.js';
import { sortDocuments } from '../sorting.js';
import { listRow, gridRow } from '../ui/templates.js';

export class DocumentList extends HTMLElement {
    constructor() {
        super();
        this.unsubscribe = null;
        this.view = 'list';
        this.sort = 'createdAt:desc';
    }

    connectedCallback() {
        this.unsubscribe = Store.subscribe((state) => this.render(state));
        this.render(Store.getState());
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    setView(view) {
        if (this.view !== view) {
            this.view = view;
            this.render(Store.getState());
        }
    }

    setSort(sort) {
        if (this.sort !== sort) {
            this.sort = sort;
            this.render(Store.getState());
        }
    }

    render(state) {
        const documentsList = Array.isArray(state?.documents) ? state.documents : [];
        const documentsSortedList = sortDocuments(documentsList, this.sort);

        this.className = `doc-list ${this.view}-view`;
        this.setAttribute('role', 'list');
        this.setAttribute('aria-label', 'Document list');

        // Map existing nodes by ID
        const existingNodes = new Map();
        Array.from(this.children).forEach(child => {
            if (child.dataset.id) existingNodes.set(child.dataset.id, child);
        });

        const fragment = document.createDocumentFragment();

        documentsSortedList.forEach(doc => {
            const docId = doc.id;
            let el = existingNodes.get(docId);

            const html = this.view === 'list' ? listRow(doc) : gridRow(doc);

            if (el) {
                // Update existing
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const newContent = temp.firstElementChild;

                if (el.innerHTML !== newContent.innerHTML) {
                    el.innerHTML = newContent.innerHTML;
                    el.className = newContent.className;
                }
                existingNodes.delete(docId);
            } else {
                // Create new
                const temp = document.createElement('div');
                temp.innerHTML = html;
                el = temp.firstElementChild;
            }

            if (el) {
                fragment.appendChild(el);
            }
        });

        // Remove nodes that are no longer in the list
        existingNodes.forEach(node => node.remove());

        // Append the fragment (moves existing nodes, adds new ones)
        this.appendChild(fragment);
    }
}

customElements.define('document-list', DocumentList);
