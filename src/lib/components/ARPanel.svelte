<script>
	import { onMount } from 'svelte';
	import { modelLinks, templateHTML } from '../stores/sceneData';
	import { interestPointsCoordinates } from '../stores/interest-points.js';

	let { toggleARPanel } = $props();
	let sceneDocs = $state(undefined);

	onMount(() => {
		let docs = $templateHTML;
		for (let point in $modelLinks) {
			const { path, scale } = $modelLinks[point];
			const { lat, lng } = $interestPointsCoordinates[point];
			docs = docs
				.replace(`MODEL_LINK_${point.toUpperCase()}`, path)
				.replace(`MODEL_SCALES_${point.toUpperCase()}`, `${scale} ${scale} ${scale}`);
			docs = docs
				.replace(`&LAT_${point.toUpperCase()}&`, lat)
				.replace(`&LNG_${point.toUpperCase()}&`, lng);
		}
		sceneDocs = docs;
	});
</script>

<div class="z-50 absolute top-30 left-0 w-full h-2/4 rounded bg-gray-500 flex flex-col justify-center items-center">
	<div class="mb-2">Scan the code located on the info board</div>
	{#if sceneDocs}
		<iframe title="ar-scene" class="w-11/12 h-3/4" srcdoc={sceneDocs}></iframe>
	{/if}
	<button class="rounded bg-blue-300 w-1/2 mt-5" onclick={toggleARPanel}>Close</button>
</div>
