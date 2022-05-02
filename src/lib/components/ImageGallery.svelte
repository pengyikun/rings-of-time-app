<script>
	import { onMount } from 'svelte';
	import { imageData, currentPoint, interestPointsInfo } from '../stores/interest-points.js';
	import { sleep } from '../functions/Utilities.js';

	export let isARAvaliable;
	export let toggleARPanel;
	let images = {};

	let isMinimize = false;
	let isPlaying = false;
	let currentImgSrc;

	onMount(() => {
		images = { ...$imageData };
		for (let point in images) {
			images[point] = images[point].map(fileName => {
				return `image/castle-img-${fileName}.jpeg`;
			});
		}
		// console.log(images);
		// currentPoint.set(2);
		playGallery();
	});

	let playGallery = async () => {
		if ($currentPoint != 'idle') {

			isPlaying = true;
			console.log(`[ImageGallery] Play gallery ${$currentPoint}`);
			//console.log(images[$currentPoint]);
			let newImgsrc = images[$currentPoint][Math.round(Math.random() * (images[$currentPoint].length - 1))];
			while (newImgsrc === currentImgSrc) {
				newImgsrc = images[$currentPoint][Math.round(Math.random() * (images[$currentPoint].length - 1))];
				await sleep(50);
			}
			currentImgSrc = newImgsrc;
			//console.log(currentImgSrc);
		}
		await sleep(5000);
		playGallery();
	};
</script>

<div class='bg-gray-300 flex flex-col items-center justify-center'>
	{#if !isMinimize}
		<div class='text-l font-bold mt-5'>{$interestPointsInfo[$currentPoint].name}</div>
		{#if isARAvaliable}
			<button class='text-sm rounded-md bg-blue-300 px-10 py-1 my-5'
							on:click={toggleARPanel}>View AR
			</button>
		{/if}
		{#if currentImgSrc}
			<img src={currentImgSrc} alt='castle-img' class='w-4/5 mt-2 mb-1 rounded-md'>
		{/if}
		<div class='text-xs m-5'>
			{$interestPointsInfo[$currentPoint].narrativeContent}
		</div>
	{/if}
	<button class='text-sm rounded-md bg-blue-300 px-10 py-1 my-5'
					on:click={()=>{isMinimize = !isMinimize}}>{isMinimize ? 'Show Point Information' : 'Hide Point\n' +
		'\t\tInformation'}
	</button>
</div>
