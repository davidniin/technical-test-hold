const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiError extends Error {
    constructor(status, message, url) {
        super(`API Error ${status}: ${message}`);
        this.name = 'ApiError';
        this.status = status;
        this.url = url;
    }
}

const apiFetch = async (endpoint, options = {}) => {
    const requestUrl = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(requestUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorMessage = await response.text().catch(() => 'Unknown error');
            throw new ApiError(response.status, errorMessage, requestUrl);
        }

        return await response.json();
    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw new Error(`Network error: ${err.message}`);
    }
}

const normalizeDocument = (apiDocument) => {
    return {
        id: String(apiDocument?.ID ?? crypto.randomUUID()),
        name: apiDocument?.Title ?? 'Untitled',
        contributors: Array.isArray(apiDocument?.Contributors)
            ? apiDocument.Contributors.map(c => c.Name)
            : [],
        version: apiDocument?.Version,
        attachments: Array.isArray(apiDocument?.Attachments)
            ? apiDocument.Attachments
            : [],
        createdAt: apiDocument?.UpdatedAt ?? new Date().toISOString()
    };
}

export const getAllDocuments = async () => { 
    const responseData = await apiFetch('/documents');

    const documentList = Array.isArray(responseData) ? responseData : [];

    return documentList.map(normalizeDocument);
}

export const createDocument = async (documentData) => {
    const responseData = await apiFetch('/documents', {
        method: 'POST',
        body: JSON.stringify(documentData)
    });
    return normalizeDocument(responseData);
}
