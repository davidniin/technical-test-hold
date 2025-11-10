import { LOCAL_DOCS_KEY } from './utils/localDocuments.js';

const appState = {
  documents: []
};

const stateSubscribers = new Set();

const notifySubscribers = () => {
  stateSubscribers.forEach(callback => {
    try { callback(appState); } catch (_) {}
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
  } catch {
    return [];
  }
};

const saveToStorage = (input) => {
  if (!canUseStorage()) return;

  try {
    let docsToSave;

    if (Array.isArray(input)) {
      docsToSave = input;
    } else {
      const current = readFromStorage();
      docsToSave = [...current, input];
    }

    window.localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docsToSave));
  } catch {
  }
};

export const Store = {
  getState() {
    return appState;
  },

  setDocuments(documentList) {
    appState.documents = Array.isArray(documentList) ? documentList.slice() : [];
    notifySubscribers();
  },

  receivedDocuments(document) {
    appState.documents = [document, ...appState.documents];
    notifySubscribers();
  },

  addNewDocument(document) {
    appState.documents = [document, ...appState.documents];
    saveToStorage(document);
    notifySubscribers();
  },

  subscribe(listener) {
    stateSubscribers.add(listener);
    return () => stateSubscribers.delete(listener);
  }
};
