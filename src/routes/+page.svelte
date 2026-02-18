<script>
	import Experience from '../lib/components/Experience.svelte';
</script>

<svelte:head>
	<title>Rings of Time</title>
</svelte:head>

<div class='w-full h-screen flex flex-col items-center font-roboto'>
	<h1 class='text-4xl text-center mt-8 uppercase font-extralight'>Rings of Time</h1>
	<h3 class='text-md text-center my-2 uppercase'>Demo App</h3>
	<div class='w-11/12 bg-gray-200 rounded-md flex flex-col'>
		<Experience />
	</div>
</div>
