import { describe, it, expect, vi } from 'vitest';
import { sleep, getCurrentTime, dateFormatter } from '../../src/lib/functions/Utilities.js';

// ---------------------------------------------------------------------------
// sleep
// ---------------------------------------------------------------------------

describe('sleep', () => {
	it('returns a Promise', () => {
		const result = sleep(0);
		expect(result).toBeInstanceOf(Promise);
		return result; // resolve it so nothing leaks
	});

	it('resolves after the given delay', async () => {
		const start = Date.now();
		await sleep(50);
		const elapsed = Date.now() - start;
		// Allow generous tolerance for CI environments
		expect(elapsed).toBeGreaterThanOrEqual(40);
	});

	it('resolves with undefined', async () => {
		const result = await sleep(0);
		expect(result).toBeUndefined();
	});

	it('zero delay resolves immediately', async () => {
		await expect(sleep(0)).resolves.toBeUndefined();
	});
});

// ---------------------------------------------------------------------------
// dateFormatter
// ---------------------------------------------------------------------------

describe('dateFormatter', () => {
	it('is an Intl.DateTimeFormat instance', () => {
		expect(dateFormatter).toBeInstanceOf(Intl.DateTimeFormat);
	});

	it('formats a Date into a non-empty string', () => {
		const formatted = dateFormatter.format(new Date());
		expect(typeof formatted).toBe('string');
		expect(formatted.length).toBeGreaterThan(0);
	});

	it('formatted output includes a colon (time separator)', () => {
		const formatted = dateFormatter.format(new Date(2024, 0, 1, 14, 30, 0));
		expect(formatted).toMatch(/:/);
	});

	it('formatted output includes AM or PM indicator', () => {
		const formatted = dateFormatter.format(new Date(2024, 0, 1, 14, 30, 0));
		expect(formatted).toMatch(/AM|PM/i);
	});
});

// ---------------------------------------------------------------------------
// getCurrentTime
// ---------------------------------------------------------------------------

describe('getCurrentTime', () => {
	it('returns a string', () => {
		expect(typeof getCurrentTime()).toBe('string');
	});

	it('returns a non-empty string', () => {
		expect(getCurrentTime().length).toBeGreaterThan(0);
	});

	it('output contains a colon (time separator)', () => {
		expect(getCurrentTime()).toMatch(/:/);
	});

	it('output contains AM or PM', () => {
		expect(getCurrentTime()).toMatch(/AM|PM/i);
	});

	it('two calls in the same second return the same value', () => {
		// Both calls happen within a few ms so the second value is the same
		const t1 = getCurrentTime();
		const t2 = getCurrentTime();
		expect(t1).toBe(t2);
	});

	it('uses the current time (mocked)', () => {
		// Pin the system clock to noon on 2024-01-01
		const fixedDate = new Date(2024, 0, 1, 12, 0, 0);
		vi.setSystemTime(fixedDate);

		const result = getCurrentTime();
		// dateFormatter is 12-hour with seconds, so noon shows as 12:00:00 PM
		expect(result).toMatch(/12:00:00/);

		vi.useRealTimers();
	});
});
