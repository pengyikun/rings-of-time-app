<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="p-8 max-w-6xl mx-auto">
	{@render children()}
</div>
