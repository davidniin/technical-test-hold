
const appState = {
  documents: []
};

const stateSubscribers = new Set();

const notifySubscribers = () => {
  stateSubscribers.forEach(callback => {
    try { callback(appState); } catch (_) {}
  });
}

export const Store = {
  getState() {
    return appState;
  },

  setDocuments(documentList) {
    appState.documents = Array.isArray(documentList) ? documentList.slice() : [];
    notifySubscribers();
  },

  subscribe(listener) {
    stateSubscribers.add(listener);
    return () => stateSubscribers.delete(listener);
  }
};
