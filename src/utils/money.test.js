import { describe, expect, it } from 'vitest';
import { formatMoney, monthKey, monthLabel } from './money';

describe('formatMoney', () => {
  it('formats INR amounts with the rupee symbol', () => {
    expect(formatMoney(1234.5, 'INR')).toContain('1,234.50');
  });
  it('handles zero and invalid input', () => {
    expect(formatMoney(0, 'INR')).toContain('0.00');
    expect(formatMoney(undefined, 'INR')).toContain('0.00');
  });
});

describe('monthKey', () => {
  it('produces a zero-padded yyyy-mm key', () => {
    expect(monthKey(new Date(2026, 0, 5))).toBe('2026-01');
    expect(monthKey(new Date(2026, 10, 23))).toBe('2026-11');
  });
});

describe('monthLabel', () => {
  it('renders a short label', () => {
    expect(monthLabel('2026-11')).toBe('Nov 2026');
  });
  it('passes through unparseable keys', () => {
    expect(monthLabel('soon')).toBe('soon');
  });
});
