import { describe, it, expect } from 'vitest';
import { formatRelative } from '../src/utils/date.js';

describe('formatRelative', () => {
  it('devuelve "in X seconds" para fechas futuras cercanas', () => {
    const now = Date.now();
    const future = new Date(now + 10 * 1000).toISOString();
    const result = formatRelative(future);
    expect(result).toMatch(/in (\d+) seconds?/);
  });

  it('devuelve "X seconds ago" para fechas pasadas cercanas', () => {
    const now = Date.now();
    const past = new Date(now - 15 * 1000).toISOString();
    const result = formatRelative(past);
    expect(result).toMatch(/(\d+) seconds? ago/);
  });

  it('devuelve "in X minutes" para minutos futuros', () => {
    const now = Date.now();
    const future = new Date(now + 3 * 60 * 1000).toISOString();
    const result = formatRelative(future);
    expect(result).toMatch(/in (\d+) minutes?/);
  });

  it('devuelve "X hours ago" para horas pasadas', () => {
    const now = Date.now();
    const past = new Date(now - 2 * 60 * 60 * 1000).toISOString();
    const result = formatRelative(past);
    expect(result).toMatch(/(\d+) hours? ago/);
  });

  it('devuelve "in X days" para días futuros', () => {
    const now = Date.now();
    const future = new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatRelative(future);
    expect(result).toMatch(/in (\d+) days?/);
  });

  it('devuelve "X months ago" para meses pasados', () => {
    const now = Date.now();
    const past = new Date(now - 3 * 30 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatRelative(past);
    expect(result).toMatch(/(\d+) months? ago/);
  });

  it('devuelve "in X years" para años futuros', () => {
    const now = Date.now();
    const future = new Date(now + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatRelative(future);
    expect(result).toMatch(/in (\d+) years?/);
  });
});
