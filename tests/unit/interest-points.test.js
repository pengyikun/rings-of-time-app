import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import {
	interestPointsCoordinates,
	interestPointsInfo,
	isExperienceRunning,
	currentPoint,
	currentCoord,
	pointsData,
	bgMusicVolume,
	narrativeVolume,
	imageData
} from '../../src/lib/stores/interest-points.js';

// ---------------------------------------------------------------------------
// Readable stores — interestPointsCoordinates
// ---------------------------------------------------------------------------

describe('interestPointsCoordinates', () => {
	it('contains entrance, 1, and 2 keys', () => {
		const coords = get(interestPointsCoordinates);
		expect(coords).toHaveProperty('entrance');
		expect(coords).toHaveProperty('1');
		expect(coords).toHaveProperty('2');
	});

	it('each coordinate has lat, lng, and radius', () => {
		const coords = get(interestPointsCoordinates);
		for (const key of Object.keys(coords)) {
			expect(coords[key]).toHaveProperty('lat');
			expect(coords[key]).toHaveProperty('lng');
			expect(coords[key]).toHaveProperty('radius');
			expect(typeof coords[key].lat).toBe('number');
			expect(typeof coords[key].lng).toBe('number');
			expect(typeof coords[key].radius).toBe('number');
		}
	});

	it('radius values are positive', () => {
		const coords = get(interestPointsCoordinates);
		for (const key of Object.keys(coords)) {
			expect(coords[key].radius).toBeGreaterThan(0);
		}
	});
});

// ---------------------------------------------------------------------------
// Readable stores — interestPointsInfo
// ---------------------------------------------------------------------------

describe('interestPointsInfo', () => {
	it('contains entrance, 1, and 2 keys', () => {
		const info = get(interestPointsInfo);
		expect(info).toHaveProperty('entrance');
		expect(info).toHaveProperty('1');
		expect(info).toHaveProperty('2');
	});

	it('each point has name and narrativeContent', () => {
		const info = get(interestPointsInfo);
		for (const key of Object.keys(info)) {
			expect(info[key]).toHaveProperty('name');
			expect(info[key]).toHaveProperty('narrativeContent');
			expect(typeof info[key].name).toBe('string');
			expect(typeof info[key].narrativeContent).toBe('string');
			expect(info[key].name.length).toBeGreaterThan(0);
			expect(info[key].narrativeContent.length).toBeGreaterThan(0);
		}
	});

	it('keys match interestPointsCoordinates', () => {
		const coordKeys = Object.keys(get(interestPointsCoordinates));
		const infoKeys = Object.keys(get(interestPointsInfo));
		expect(infoKeys.sort()).toEqual(coordKeys.sort());
	});
});

// ---------------------------------------------------------------------------
// Readable stores — imageData
// ---------------------------------------------------------------------------

describe('imageData', () => {
	it('contains entrance, 1, and 2 keys', () => {
		const data = get(imageData);
		expect(data).toHaveProperty('entrance');
		expect(data).toHaveProperty('1');
		expect(data).toHaveProperty('2');
	});

	it('each point has an array of image identifiers', () => {
		const data = get(imageData);
		for (const key of Object.keys(data)) {
			expect(Array.isArray(data[key])).toBe(true);
			expect(data[key].length).toBeGreaterThan(0);
		}
	});
});

// ---------------------------------------------------------------------------
// Writable stores — default values
// ---------------------------------------------------------------------------

describe('writable stores default values', () => {
	it('isExperienceRunning defaults to false', () => {
		expect(get(isExperienceRunning)).toBe(false);
	});

	it('currentPoint defaults to "1"', () => {
		expect(get(currentPoint)).toBe('1');
	});

	it('currentCoord defaults to an object with lat and lng', () => {
		const coord = get(currentCoord);
		expect(coord).toHaveProperty('lat');
		expect(coord).toHaveProperty('lng');
		expect(typeof coord.lat).toBe('number');
		expect(typeof coord.lng).toBe('number');
	});

	it('pointsData defaults to empty object', () => {
		expect(get(pointsData)).toEqual({});
	});

	it('bgMusicVolume defaults to 0.9', () => {
		expect(get(bgMusicVolume)).toBe(0.9);
	});

	it('narrativeVolume defaults to 0.3', () => {
		expect(get(narrativeVolume)).toBe(0.3);
	});
});

// ---------------------------------------------------------------------------
// Writable stores — mutability
// ---------------------------------------------------------------------------

describe('writable stores are mutable', () => {
	it('isExperienceRunning can be set', () => {
		isExperienceRunning.set(true);
		expect(get(isExperienceRunning)).toBe(true);
		isExperienceRunning.set(false);
	});

	it('currentPoint can be set', () => {
		currentPoint.set('entrance');
		expect(get(currentPoint)).toBe('entrance');
		currentPoint.set('1');
	});

	it('bgMusicVolume can be updated', () => {
		bgMusicVolume.update((v) => v * 0.5);
		const val = get(bgMusicVolume);
		expect(val).toBeCloseTo(0.45, 5);
		bgMusicVolume.set(0.9);
	});
});
