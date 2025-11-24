import { LOCAL_DOCS_KEY } from './utils/localDocuments.js';

const appState = {
  documents: []
};

const stateSubscribers = new Set();

const notifySubscribers = () => {
  stateSubscribers.forEach(callback => {
    try { callback(Store.getState()); } catch (err) { console.error('[Store] Subscriber error:', err); }
  });
};

const canUseStorage = () => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

const readFromStorage = () => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_DOCS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Store] Error reading from storage:', err);
    return [];
  }
};

const MAX_DOCS = 50; // Limit local storage to avoid quota issues

const saveToStorage = (input) => {
  if (!canUseStorage()) return;

  try {
    let docsToSave;

    if (Array.isArray(input)) {
      docsToSave = input;
    } else {
      const current = readFromStorage();
      // Append new doc
      docsToSave = [...current, input];
    }

    // LRU-like eviction (keep last N)
    if (docsToSave.length > MAX_DOCS) {
      docsToSave = docsToSave.slice(-MAX_DOCS);
    }

    window.localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docsToSave));
  } catch (err) {
    console.error('[Store] Error saving to storage:', err);
  }
};

export const Store = {
  getState() {
    // Return a copy to prevent external mutation
    return { ...appState, documents: [...appState.documents] };
  },

  setDocuments(documentList) {
    appState.documents = Array.isArray(documentList) ? documentList.slice() : [];
    notifySubscribers();
  },

  receivedDocuments(document) {
    // Append to end (fix test expectation) and persist
    appState.documents = [...appState.documents, document];
    saveToStorage(document);
    notifySubscribers();
  },

  addNewDocument(document) {
    // Append to end and persist
    appState.documents = [...appState.documents, document];
    saveToStorage(document);
    notifySubscribers();
  },

  subscribe(listener) {
    stateSubscribers.add(listener);
    return () => stateSubscribers.delete(listener);
  }
};
