import { describe, it, expect, vi } from 'vitest';
import { selectElement, selectAllElements, onEvent, showElement, hideElement } from '../src/utils/dom.js';

describe('dom utils', () => {
    it('selectElement y selectAllElements buscan en el DOM', () => {
        document.body.innerHTML = `
            <div id="container">
                <span class="items-to-display">X</span>
                <span class="items-to-display">Y</span>
            </div>
        `;

        const fakeContainer = selectElement('#container');
        expect(fakeContainer).not.toBeNull();

        const fakeItems = selectAllElements('.items-to-display');
        expect(fakeItems).toHaveLength(2);
        expect(fakeItems[0].textContent).toBe('X');
    });

    it('onEvent devuelve función de cleanup y es null-safe', () => {
        const fakeButton = document.createElement('button');
        const handler = vi.fn();

        const cleanup = onEvent(fakeButton, 'click', handler);
        fakeButton.click();
        expect(handler).toHaveBeenCalledTimes(1);

        cleanup();
        fakeButton.click();
        expect(handler).toHaveBeenCalledTimes(1);

        const cleanupNull = onEvent(null, 'click', handler);
        expect(() => cleanupNull()).not.toThrow();
    });

    it('showElement / hideElement controlan hidden', () => {
        const fakeDivToHide = document.createElement('div');

        hideElement(fakeDivToHide);
        expect(fakeDivToHide.hidden).toBe(true);

        showElement(fakeDivToHide);
        expect(fakeDivToHide.hidden).toBe(false);
    });
});
