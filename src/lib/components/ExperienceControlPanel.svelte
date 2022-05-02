<script>
	import { currentPoint, bgMusicVolume, narrativeVolume, isExperienceRunning } from '../stores/interest-points';

	export let toggleARPanel;
	export let deviceHeading;
	export let startExperience;
	export let stopExperience;
	export let soundHint;
</script>

<div class='w-full flex flex-row justify-around items-center'>
	<div class='w-7/12 flex flex-col items-center text-xs mb-3'>
		<div class='mt-1 text-xl'>At Zone {$currentPoint}</div>
		<div class='mt-1'>Sound Direction: {soundHint.direction}</div>
		<div class='mt-1'>Sound Distance: {soundHint.distance.toFixed(2)}m</div>
		<div class='mt-1'>Bg Volume: {($bgMusicVolume * 100).toFixed(2)}%</div>
		<div class='mt-1'>Narrative Volume: {($narrativeVolume * 100).toFixed(2)}%</div>
		{#if deviceHeading}
			<div class='mt-1'>Heading: {deviceHeading.toFixed(0)}d</div>
		{/if}
	</div>
	<div class='w-4/12 flex flex-col'>
		{#if !$isExperienceRunning}
			<button class='rounded-md bg-blue-500 text-white p-2' on:click={startExperience}
			>Start
			</button
			>
		{:else}
			<button class='rounded-md bg-blue-500 text-white p-2 mb-2' on:click={toggleARPanel}> View in AR</button>
			<button class='rounded-md bg-blue-500 text-white p-2' on:click={stopExperience}>Stop
			</button
			>
		{/if}
	</div>
</div>