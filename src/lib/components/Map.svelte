<script>

	import { onMount } from 'svelte';
	import { currentCoord, interestPointsInfo, interestPointsCoordinates } from '../stores/interest-points';

	export let updateStatus;

	$: $currentCoord, updateMap();
	let container;
	let map;
	let marker;
	let circles = {};
	let zoom = 18;

	onMount(async () => {
		// Set center of the map to default coordinates
		// and add a marker default marker
		updateStatus('Loaded map module');
		const { lat, lng } = $currentCoord;
		map = new google.maps.Map(container, {
			zoom,
			center: $currentCoord,
			disableDefaultUI: true
		});
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			title: 'Your current location'
		});
		updateCircle();
	});

	export let updateCircle = () => {
		circles = {};
		for (let points in $interestPointsInfo) {
			const coordinate = $interestPointsCoordinates[points];
			let interestPointCircle = new google.maps.Circle({
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map,
				center: coordinate,
				radius: coordinate.radius
			});
			circles[points] = interestPointCircle;
		}

	};


	let updateMap = () => {
		if (!map) {
			return;
		}
		console.log('Updating map');
		const { lat, lng } = $currentCoord;
		let mapLocation = new google.maps.LatLng(lat, lng);
		map.setCenter(mapLocation);
		if (marker) {
			marker.setMap(null);
		}
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			title: 'Your current location'
		});
	};


</script>

<div
	class='w-4/5 h-64 mb-2 flex flex-col items-center justify-center rounded-md border-1 border-grey-500'
>
	<h1>Map</h1>
	<div class='mt-1 text-xs'>
		Coordinates: {$currentCoord.lat.toFixed(4)},{$currentCoord.lng.toFixed(4)}
	</div>
	<div class='min-w-40 min-h-40 w-full h-full m-1 rounded-md' bind:this={container} />
</div>