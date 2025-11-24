
import { Store } from '../store.js';
import { getAllDocuments, createDocument } from '../api.js';
import { getLocalDocuments, mergeDocuments } from '../utils/localDocuments.js';
import { connectWS } from '../websocket/main.js';

class DocumentService {
    constructor() {
        this.disconnectWS = null;
    }

    async init() {
        try {
            const documents = await getAllDocuments();
            const localDocs = getLocalDocuments();
            const merged = mergeDocuments(documents, localDocs);
            Store.setDocuments(merged);
        } catch (err) {
            Store.setDocuments([]);
            console.warn('[DocumentService] Failed to load documents:', err);
            throw new Error('No se pudieron cargar documentos (puedes crear locales).');
        }

        this.connectToLiveUpdates();
    }

    connectToLiveUpdates() {
        this.disconnectWS = connectWS({
            onOpen: () => {
                // Could dispatch a global event or update store status
                console.log('[DocumentService] WS Connected');
            },
            onClose: () => {
                console.log('[DocumentService] WS Disconnected');
            },
            onError: () => {
                console.error('[DocumentService] WS Error');
            },
            onDocumentCreated: (doc) => {
                Store.receivedDocuments(doc);
                // Dispatch event for UI notification if needed, 
                // though Store subscription should handle data updates.
                window.dispatchEvent(new CustomEvent('document-created', { detail: doc }));
            },
        });
    }

    async create(data) {
        // Here we could add API call to create document if backend supported it
        // For now, we simulate local creation as per original logic
        const newDocument = {
            id: crypto.randomUUID(),
            name: data.name,
            version: data.version,
            contributors: data.contributors,
            attachments: data.attachments,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        Store.addNewDocument(newDocument);
        return newDocument;
    }

    dispose() {
        if (typeof this.disconnectWS === 'function') {
            this.disconnectWS();
        }
    }
}

export const documentService = new DocumentService();
