import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getLocalDocuments, saveLocalDocument, mergeDocuments } from '../src/utils/localDocuments.js';
import { LOCAL_DOCS_KEY } from '../src/utils/localDocuments.js';

function clearLocalStorage() {
    localStorage.removeItem(LOCAL_DOCS_KEY);
}

describe('localDocuments utils', () => {
    beforeEach(() => {
        clearLocalStorage();
    });
    afterEach(() => {
        clearLocalStorage();
    });

    it('getLocalDocuments returns [] if nothing stored', () => {
        expect(getLocalDocuments()).toEqual([]);
    });

    it('mergeDocuments merges and prefers most recent by createdAt', () => {
        const fakeBackend = [
            { id: '1', name: 'A', createdAt: '2022-01-01T00:00:00Z' },
            { id: '2', name: 'B', createdAt: '2022-01-01T00:00:00Z' }
        ];
        const fakeLocal = [
            { id: '2', name: 'B-local', createdAt: '2023-01-01T00:00:00Z' },
            { id: '3', name: 'C', createdAt: '2022-01-01T00:00:00Z' }
        ];
        const merged = mergeDocuments(fakeBackend, fakeLocal);
        expect(merged.find(d => d.id === '2').name).toBe('B-local');
        expect(merged.find(d => d.id === '3').name).toBe('C');
        expect(merged.find(d => d.id === '1').name).toBe('A');
        expect(merged).toHaveLength(3);
    });
});
