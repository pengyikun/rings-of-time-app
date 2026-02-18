import { describe, it, expect } from 'vitest';
import {
	calculateBearing,
	calculateDirectionAngle,
	calculate2DPos,
	mapDegreeToPoints
} from '../../src/lib/functions/GeoData.js';

// ---------------------------------------------------------------------------
// calculateBearing
// Note: the function takes lat/lng in degrees and passes them directly to
// Math.sin/cos (which expect radians). This is the existing behaviour and
// these tests lock it in rather than correcting it.
// ---------------------------------------------------------------------------

describe('calculateBearing', () => {
	it('returns a numeric value', () => {
		const result = calculateBearing({ lat: 52.94772, lng: -1.14579 }, { lat: 52.95024, lng: -1.15392 });
		expect(typeof result).toBe('number');
	});

	it('result is always in the range (0, 360]', () => {
		const pairs = [
			[{ lat: 0, lng: 0 }, { lat: 1, lng: 0 }],
			[{ lat: 0, lng: 0 }, { lat: 0, lng: 1 }],
			[{ lat: 0, lng: 0 }, { lat: -1, lng: 0 }],
			[{ lat: 0, lng: 0 }, { lat: 0, lng: -1 }],
			[{ lat: 52.94772, lng: -1.14579 }, { lat: 52.95024, lng: -1.15392 }]
		];
		for (const [from, to] of pairs) {
			const b = calculateBearing(from, to);
			expect(b).toBeGreaterThan(0);
			expect(b).toBeLessThanOrEqual(360);
		}
	});

	it('same-point input returns 360', () => {
		expect(calculateBearing({ lat: 0, lng: 0 }, { lat: 0, lng: 0 })).toBe(360);
	});

	it('bearing to the east (positive longitude) returns 270', () => {
		expect(calculateBearing({ lat: 0, lng: 0 }, { lat: 0, lng: 1 })).toBeCloseTo(270, 5);
	});

	it('bearing to the west (negative longitude) returns 90', () => {
		expect(calculateBearing({ lat: 0, lng: 0 }, { lat: 0, lng: -1 })).toBeCloseTo(90, 5);
	});

	it('bearing to the north (positive latitude) returns 360', () => {
		expect(calculateBearing({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(360, 5);
	});

	it('two different points return different bearings', () => {
		const b1 = calculateBearing({ lat: 0, lng: 0 }, { lat: 0, lng: 1 });
		const b2 = calculateBearing({ lat: 0, lng: 0 }, { lat: 0, lng: -1 });
		expect(b1).not.toBe(b2);
	});
});

// ---------------------------------------------------------------------------
// calculateDirectionAngle
// Normalises the difference between a compass heading and a bearing into
// the range (-180, 180].
// ---------------------------------------------------------------------------

describe('calculateDirectionAngle', () => {
	it('returns 0 when heading and bearing are equal', () => {
		expect(calculateDirectionAngle(0, 0)).toBe(0);
		expect(calculateDirectionAngle(90, 90)).toBe(90 - 90); // 0 via formula
	});

	it('returns positive angle when target is clockwise of heading', () => {
		expect(calculateDirectionAngle(0, 90)).toBe(90);
		expect(calculateDirectionAngle(90, 180)).toBe(90);
	});

	it('returns negative angle when target is counter-clockwise of heading', () => {
		expect(calculateDirectionAngle(180, 90)).toBe(-90);
	});

	it('wraps correctly for small cross-zero difference (10 → 350 = -20)', () => {
		expect(calculateDirectionAngle(10, 350)).toBe(-20);
	});

	it('returns a numeric value', () => {
		expect(typeof calculateDirectionAngle(45, 135)).toBe('number');
	});
});

// ---------------------------------------------------------------------------
// calculate2DPos
// ---------------------------------------------------------------------------

describe('calculate2DPos', () => {
	it('returns an object with x and y properties', () => {
		const result = calculate2DPos(1, 0);
		expect(result).toHaveProperty('x');
		expect(result).toHaveProperty('y');
	});

	it('zero distance produces origin regardless of angle', () => {
		const result = calculate2DPos(0, 45);
		expect(result.x).toBeCloseTo(0, 10);
		expect(result.y).toBeCloseTo(0, 10);
	});

	it('angle 0° points along positive x-axis', () => {
		const result = calculate2DPos(1, 0);
		expect(result.x).toBeCloseTo(1, 10);
		expect(result.y).toBeCloseTo(0, 10);
	});

	it('angle 90° points along positive y-axis', () => {
		const result = calculate2DPos(1, 90);
		expect(result.x).toBeCloseTo(0, 10);
		expect(result.y).toBeCloseTo(1, 10);
	});

	it('angle 45° produces equal x and y at distance √2', () => {
		const result = calculate2DPos(10, 45);
		expect(result.x).toBeCloseTo(7.071, 2);
		expect(result.y).toBeCloseTo(7.071, 2);
	});

	it('distance scales x and y linearly', () => {
		const r1 = calculate2DPos(1, 30);
		const r2 = calculate2DPos(5, 30);
		expect(r2.x).toBeCloseTo(r1.x * 5, 10);
		expect(r2.y).toBeCloseTo(r1.y * 5, 10);
	});
});

// ---------------------------------------------------------------------------
// mapDegreeToPoints
// ---------------------------------------------------------------------------

describe('mapDegreeToPoints', () => {
	it('returns an object with x, y, and directionHint', () => {
		const result = mapDegreeToPoints(0);
		expect(result).toHaveProperty('x');
		expect(result).toHaveProperty('y');
		expect(result).toHaveProperty('directionHint');
	});

	it('0° → Forward', () => {
		expect(mapDegreeToPoints(0)).toEqual({ x: 0, y: 1, directionHint: 'Forward' });
	});

	it('1–45° → Top Right', () => {
		expect(mapDegreeToPoints(1)).toEqual({ x: 1, y: 1, directionHint: 'Top Right' });
		expect(mapDegreeToPoints(45)).toEqual({ x: 1, y: 1, directionHint: 'Top Right' });
	});

	it('46–90° → Right', () => {
		expect(mapDegreeToPoints(46)).toEqual({ x: 1, y: 0, directionHint: 'Right' });
		expect(mapDegreeToPoints(90)).toEqual({ x: 1, y: 0, directionHint: 'Right' });
	});

	it('91–135° → Bottom Right', () => {
		expect(mapDegreeToPoints(91)).toEqual({ x: 1, y: -1, directionHint: 'Bottom Right' });
		expect(mapDegreeToPoints(135)).toEqual({ x: 1, y: -1, directionHint: 'Bottom Right' });
	});

	it('136–180° → Backward', () => {
		expect(mapDegreeToPoints(136)).toEqual({ x: 0, y: -1, directionHint: 'Backward' });
		expect(mapDegreeToPoints(180)).toEqual({ x: 0, y: -1, directionHint: 'Backward' });
	});

	it('181–225° → Bottom Left', () => {
		expect(mapDegreeToPoints(181)).toEqual({ x: -1, y: -1, directionHint: 'Bottom Left' });
		expect(mapDegreeToPoints(225)).toEqual({ x: -1, y: -1, directionHint: 'Bottom Left' });
	});

	it('226–270° → Left', () => {
		expect(mapDegreeToPoints(226)).toEqual({ x: -1, y: 0, directionHint: 'Left' });
		expect(mapDegreeToPoints(270)).toEqual({ x: -1, y: 0, directionHint: 'Left' });
	});

	it('271–360° → Top Left', () => {
		expect(mapDegreeToPoints(271)).toEqual({ x: -1, y: 1, directionHint: 'Top Left' });
		expect(mapDegreeToPoints(315)).toEqual({ x: -1, y: 1, directionHint: 'Top Left' });
		expect(mapDegreeToPoints(316)).toEqual({ x: -1, y: 1, directionHint: 'Top Left' });
		expect(mapDegreeToPoints(360)).toEqual({ x: -1, y: 1, directionHint: 'Top Left' });
	});

	it('> 360° falls through to default Forward position', () => {
		expect(mapDegreeToPoints(361)).toEqual({ x: 0, y: 0, directionHint: 'Forward' });
	});

	it('covers all 8 compass directions', () => {
		const hints = [0, 22, 67, 112, 157, 202, 247, 292].map(
			(d) => mapDegreeToPoints(d).directionHint
		);
		expect(hints).toEqual([
			'Forward',
			'Top Right',
			'Right',
			'Bottom Right',
			'Backward',
			'Bottom Left',
			'Left',
			'Top Left'
		]);
	});
});
