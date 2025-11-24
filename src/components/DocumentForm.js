
import { documentService } from '../services/DocumentService.js';

export class DocumentForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Wait for children to be parsed
        setTimeout(() => {
            this.form = this.querySelector('form');
            this.modal = this.closest('dialog') || document.getElementById('new-modal-for-new-doc');

            if (this.form) {
                this.form.addEventListener('submit', this.handleSubmit.bind(this));
            } else {
                console.error('DocumentForm: <form> not found within component');
            }
        }, 0);
    }

    disconnectedCallback() {
        if (this.form) {
            this.form.removeEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);

        const parseList = (value) => String(value ?? '').split(',').map(s => s.trim()).filter(Boolean);

        const nameValue = String(formData.get('name') ?? '').trim();
        const versionValue = String(formData.get('version') ?? '').trim();
        const contributorsList = parseList(formData.get('contributors'));
        const attachmentsList = parseList(formData.get('attachments'));

        // Validation
        if (!nameValue) {
            this.dispatchToast('Name is required');
            return;
        }
        if (nameValue.length > 200) {
            this.dispatchToast('Name is too long (max 200)');
            return;
        }

        const versionRegex = /^\d+\.\d+\.\d+$/;
        if (!versionValue || !versionRegex.test(versionValue)) {
            this.dispatchToast('Version must be in format X.Y.Z (e.g. 1.0.0)');
            return;
        }

        const urlRegex = /^(http|https):\/\/[^ "]+$/;
        const invalidUrl = attachmentsList.find(url => !urlRegex.test(url));
        if (invalidUrl) {
            this.dispatchToast('Invalid URL in attachments: ' + invalidUrl);
            return;
        }

        try {
            await documentService.create({
                name: nameValue,
                version: versionValue,
                contributors: contributorsList,
                attachments: attachmentsList
            });

            this.dispatchToast('New document added');
            this.form.reset();
            if (this.modal && typeof this.modal.close === 'function') {
                this.modal.close();
            }
        } catch (err) {
            console.error(err);
            this.dispatchToast('Error creating document');
        }
    }

    dispatchToast(message) {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: message,
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('document-form', DocumentForm);
