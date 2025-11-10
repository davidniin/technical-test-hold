import { describe, it, expect, vi } from 'vitest';
import { Store } from '../src/store.js';

describe('Store', () => {
  it('setDocuments reemplaza la lista de documentos', () => {
    const fakeDocsArray = [{ id: '001' }, { id: '002' }];
    Store.setDocuments(fakeDocsArray);

    const fakeState = Store.getState();
    expect(fakeState.documents).toHaveLength(2);
    expect(fakeState.documents[0].id).toBe('001');
    expect(fakeState.documents[1].id).toBe('002');

    expect(fakeState.documents).not.toBe(fakeDocsArray);
  });

  it('addDocument inserta al inicio y emite a los suscriptores', () => {
    const spy = vi.fn();
    const unsubscribe = Store.subscribe(spy);

    Store.setDocuments([{ id: 'x' }]);
    spy.mockClear();

    Store.addDocument({ id: 'y' });

    const fakeState = Store.getState();
    expect(fakeState.documents.map(d => d.id)).toEqual(['x', 'y']);
    expect(spy).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it('subscribe devuelve una función que desuscribe', () => {
    const spy = vi.fn();
    const unsubscribe = Store.subscribe(spy);

    Store.setDocuments([{ id: 'x' }]);
    expect(spy).toHaveBeenCalledTimes(1);

    unsubscribe();
    Store.setDocuments([{ id: 'y' }]);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
