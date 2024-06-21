import { describe, it, expect, beforeEach } from 'vitest';
import { writable } from 'svelte/store';

let showModal;
function toggleModal() {
  showModal.update(value => !value);
}

beforeEach(() => {
  showModal = writable(false);
});

describe('Modal Toggle', () => {
  it('should toggle modal visibility', () => {
    let value;
    showModal.subscribe(v => value = v);

    toggleModal();
    expect(value).toBe(true);

    toggleModal();
    expect(value).toBe(false);
  });
});
