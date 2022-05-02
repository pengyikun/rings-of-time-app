export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const dateFormatter = new Intl.DateTimeFormat('en', {
	hour12: true,
	hour: 'numeric',
	minute: '2-digit',
	second: '2-digit'
});

export let getCurrentTime = () => {
	return dateFormatter.format(new Date());
};