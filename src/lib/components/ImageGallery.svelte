<script>
	import { onMount, onDestroy } from 'svelte';
	import { imageData, currentPoint, interestPointsInfo } from '../stores/interest-points.js';
	import { sleep } from '../functions/Utilities.js';

	let { isARAvaliable, toggleARPanel } = $props();
	let images = {};

	let isMinimize = $state(false);
	let currentImgSrc = $state(undefined);
	let cancelled = false;

	onMount(() => {
		images = { ...$imageData };
		for (let point in images) {
			images[point] = images[point].map((fileName) => {
				return `image/castle-img-${fileName}.jpeg`;
			});
		}
		playGallery();
	});

	onDestroy(() => {
		cancelled = true;
	});

	let playGallery = async () => {
		while (!cancelled) {
			if ($currentPoint != 'idle') {
				let list = images[$currentPoint] ?? [];
				if (list.length === 1) {
					currentImgSrc = list[0];
				} else if (list.length > 1) {
					let newImgsrc = list[Math.floor(Math.random() * list.length)];
					let retries = 0;
					while (newImgsrc === currentImgSrc && retries < 5) {
						newImgsrc = list[Math.floor(Math.random() * list.length)];
						retries++;
					}
					currentImgSrc = newImgsrc;
				}
			}
			await sleep(5000);
		}
	};
</script>

<div class="bg-gray-300 flex flex-col items-center justify-center">
	{#if !isMinimize}
		<div class="text-l font-bold mt-5">{$interestPointsInfo[$currentPoint].name}</div>
		{#if isARAvaliable}
			<button class="text-sm rounded-md bg-blue-300 px-10 py-1 my-5" onclick={toggleARPanel}>View AR</button>
		{/if}
		{#if currentImgSrc}
			<img src={currentImgSrc} alt="castle-img" class="w-4/5 mt-2 mb-1 rounded-md" />
		{/if}
		<div class="text-xs m-5">
			{$interestPointsInfo[$currentPoint].narrativeContent}
		</div>
	{/if}
	<button
		class="text-sm rounded-md bg-blue-300 px-10 py-1 my-5"
		onclick={() => {
			isMinimize = !isMinimize;
		}}>{isMinimize ? 'Show Point Information' : 'Hide Point Information'}</button
	>
</div>
