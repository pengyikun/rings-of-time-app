<script>

	import {pointsData} from '../stores/interest-points'

</script>

<div class='w-full flex flex-col items-center justify-center'>
	<div class='flex flex-row text-xs w-full mb-1'>
		<span class='w-2/12 text-center'>Zone</span>
		<span class='w-2/12 text-center'>Distance</span>
		<span class='w-2/12 text-center'>Bearing</span>
		<span class='w-2/12 text-center'>Direction</span>
		<span class='w-2/12 text-center'>2D Pos</span>
		<span class='w-2/12 text-center'>Hint</span>
	</div>

	{#each Object.entries($pointsData) as [pointName, data]}
		<div class='flex flex-row text-xs w-full mb-1'>
			<span class='w-2/12 text-center'>{pointName}</span>
			<span class='w-2/12 text-center'>{data.distance.toFixed(0)}m</span>
			<span class='w-2/12 text-center'>{data.direction.bearing.toFixed(0)}d</span>
			<span class='w-2/12 text-center'>{data.direction.directionAngel.toFixed(0)}d</span>
			<span class='w-2/12 text-center'
			>{data.direction.x.toFixed(0)},{data.direction.y.toFixed(0)}</span
			>
			<span class='w-2/12 text-center'>{data.direction.directionHint}</span>
		</div>
	{/each}
</div>