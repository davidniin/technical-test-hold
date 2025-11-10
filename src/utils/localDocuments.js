export const LOCAL_DOCS_KEY = 'localDocuments';

export const getLocalDocuments = () => {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_DOCS_KEY) || '[]');
    } catch {
        return [];
    }
}

export const mergeDocuments = (backendDocs, localDocs) => {
    const merged = [...backendDocs];
    for (const localDoc of localDocs) {
        const idx = merged.findIndex(d => d.id === localDoc.id);
        if (idx === -1) {
            merged.push(localDoc);
        } else {
            if (new Date(localDoc.createdAt) > new Date(merged[idx].createdAt)) {
                merged[idx] = localDoc;
            }
        }
    }
    return merged;
}
