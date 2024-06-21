import { describe, it, expect, beforeEach } from 'vitest';
import { writable, get } from 'svelte/store';

// Mock the timer store and functions
let timer = writable(1500);
let isRunning = writable(false);

function startTimer() {
    isRunning.set(true);
    timer.update(n => n - 1);
}

function resetTimer() {
    timer.set(1500);
    isRunning.set(false);
}

beforeEach(() => {
    timer.set(1500);
    isRunning.set(false);
});

describe('Timer', () => {
    it('should start the timer', () => {
        startTimer();
        expect(get(timer)).toBe(1499);
        expect(get(isRunning)).toBe(true);
    });

    it('should reset the timer', () => {
        startTimer();
        resetTimer();
        expect(get(timer)).toBe(1500);
        expect(get(isRunning)).toBe(false);
    });
});
