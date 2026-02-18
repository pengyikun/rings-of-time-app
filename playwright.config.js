/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		timeout: 120000
	},
	use: {
		baseURL: 'http://localhost:4173'
	}
};

export default config;
