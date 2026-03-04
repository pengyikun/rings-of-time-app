import { expect, test } from '@playwright/test';

/**
 * Injects a minimal Google Maps stub so onMount in Experience.svelte
 * can complete without hanging on `while (!google)`.
 */
function mockGoogleMaps(page) {
	return page.addInitScript(() => {
		class LatLng {
			constructor(lat, lng) {
				this.lat = lat;
				this.lng = lng;
			}
		}
		window.google = {
			maps: {
				Map: class {
					constructor() {}
					setCenter() {}
				},
				Marker: class {
					constructor() {}
					setMap() {}
					setPosition() {}
				},
				LatLng,
				Circle: class {
					constructor() {}
				},
				geometry: {
					spherical: {
						computeDistanceBetween: () => 500
					}
				}
			}
		};
	});
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

test.describe('Home page', () => {
	test('has correct page title', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page).toHaveTitle('Rings of Time');
	});

	test('has correct h1 heading', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.locator('h1')).toHaveText('Rings of Time');
	});

	test('has correct h3 subheading', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.locator('h3')).toHaveText('Demo App');
	});

	test('shows status indicator', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		// Status badge is always rendered regardless of Google Maps state
		await expect(page.locator('.rounded.bg-gray-400').first()).toBeVisible();
	});

	test('shows "At Zone" text in control panel', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText(/At Zone/)).toBeVisible();
	});

	test('shows sound direction display', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText(/Sound Direction:/)).toBeVisible();
	});

	test('shows sound distance display', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText(/Sound Distance:/)).toBeVisible();
	});

	test('shows background volume display', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText(/Bg Volume:/)).toBeVisible();
	});

	test('shows narrative volume display', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText(/Narrative Volume:/)).toBeVisible();
	});

	test('shows Start button when experience is not running', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
	});

	test('does not show Stop button before experience starts', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'Stop' })).not.toBeVisible();
	});

	test('does not show View in AR button before experience starts', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'View in AR' })).not.toBeVisible();
	});
});

// ---------------------------------------------------------------------------
// Location info table
// ---------------------------------------------------------------------------

test.describe('Location info table', () => {
	test('shows Zone column header', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText('Zone').first()).toBeVisible();
	});

	test('shows Distance column header', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText('Distance').first()).toBeVisible();
	});

	test('shows Bearing column header', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText('Bearing').first()).toBeVisible();
	});

	test('shows Direction column header', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText('Direction').first()).toBeVisible();
	});

	test('shows Hint column header', async ({ page }) => {
		await mockGoogleMaps(page);
		await page.goto('/');
		await expect(page.getByText('Hint').first()).toBeVisible();
	});
});
