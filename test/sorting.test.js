import { describe, it, expect } from 'vitest';
import { sortDocuments } from '../src/sorting.js';

const fakeDocsArray = [
    {
        id: '001',
        name: 'Legolas',
        version: '1.23.4',
        createdAt: '2025-01-21T10:00:00Z'
    },
    {
        id: '002',
        name: 'Aragorn',
        version: '2.21.3',
        createdAt: '2025-01-21T10:20:00Z'
    },
    {
        id: '003',
        name: 'Gimbly',
        version: '1.23.3',
        createdAt: '2024-12-01T10:00:00Z'
    }
];

describe('sortDocuments', () => {
    it('devuelve [] si docs no es un array', () => {
        const sorted = sortDocuments(null, 'name:asc');
        expect(sorted).toEqual([]);
    });
    it('ordena por createdAt desc por defecto', () => {
        const sorted = sortDocuments(fakeDocsArray);
        expect(sorted.map(d => d.id)).toEqual(['002', '001', '003']);
    });

    it('ordena por name asc (case-insensitive)', () => {
        const sorted = sortDocuments(fakeDocsArray, 'name:asc');
        expect(sorted.map(d => d.name.toLowerCase())).toEqual([
            'aragorn',
            'gimbly',
            'legolas'
        ]);
    });

    it('ordena por version desc de forma numérica', () => {
        const sorted = sortDocuments(fakeDocsArray, 'version:desc');
         expect(sorted.map(d => Number(d.id))).toEqual([2, 1, 3]);
    });
});
