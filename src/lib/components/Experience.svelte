<svelte:head>
	<script
		src='https://maps.googleapis.com/maps/api/js?key=GOOGLE_MAP_API_KEY&libraries=geometry&callback=initMap'>
	</script>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import { getCurrentTime, sleep } from '../functions/Utilities';
	import { calculateBearing, calculateDirectionAngle, mapDegreeToPoints } from '../functions/GeoData';
	import { Howl } from 'howler';
	import {
		bgMusicVolume,
		currentCoord,
		currentPoint,
		interestPointsInfo,
		interestPointsCoordinates,
		isExperienceRunning, narrativeVolume,
		pointsData
	} from '../stores/interest-points';
	import Map from './Map.svelte';
	import LocationInfoTable from './LocationInfoTable.svelte';
	import ExperienceControlPanel from './ExperienceControlPanel.svelte';
	import ARPanel from './ARPanel.svelte';
	import ImageGallery from './ImageGallery.svelte';

	let isOrientationEnabled = false;
	let isInitialized = false;
	let googleLoaded = false;

	let isImageGalleryAvaliable = false;
	let isARAvaliable = false;
	let isARPanelOpened = false;


	let map;
	let watchId;

	let status = 'Idle';
	let soundHint = { direction: 'idle', distance: 0 };
	let deviceHeading = 0;
	let backgroundMusicAudios = {};
	let narrativeAudios = {};

	onMount(async () => {
		updateStatus('Initializing');

		// Sleep until google module is fully loaded
		while (!google) {
			console.log('Awaiting google module');
			await sleep(500);
		}

		// Set center of the map to default coordinates
		// and add a marker default marker
		googleLoaded = true;
		updateStatus('Idle');
	});

	let startExperience = () => {
		// Run starts if geolocation permission is set to allowed by user
		if (navigator.geolocation) {
			updateStatus('Locating user');
			isExperienceRunning.set(true);
			if (!isInitialized) {
				initConfig();
			}
			//return;
			monitorGeoLocation();

			// Check if device orientation permission is set to allowed by user
			// This is essential for spatial audio and not supported by non-mobile device
			try {
				monitorOrientation();
			} catch (err) {
				updateStatus('Spatial audio is turned off (no orientation permission)');
			}
		} else {
			updateStatus('Geolocation is disabled');
		}
	};

	let initConfig = () => {
		backgroundMusicAudios['idle'] = {
			audio: new Howl({
				src: [`/audio/bg/idle.mp4`],
				stereo: 0
			}),
			soundId: null
		};
		narrativeAudios['idle'] = {
			audio: null,
			soundId: null
		};
		for (let points in $interestPointsInfo) {
			backgroundMusicAudios[points] = {
				audio: new Howl({
					src: [`/audio/bg/${points}.mp4`],
					stereo: 0
				}),
				soundId: null
			};
			narrativeAudios[points] = {
				audio: new Howl({
					src: [`/audio/narrative/${points}.mp3`],
					stereo: 0
				}),
				soundId: null
			};

			// Stores operation
			pointsData.update(d => {
				let data = { ...d };
				data[points] = {
					distance: 0,
					direction: {
						bearing: 0,
						directionAngel: 0,
						x: 0,
						y: 0,
						directionHint: 'Idle'
					}
				};
				return data;
			});
		}
		//console.log($pointsData);
		isInitialized = true;
		//console.log(backgroundMusicAudios);
	};

	let monitorGeoLocation = () => {
		let watchOption = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		watchId = navigator.geolocation.watchPosition(
			monitorSuccessHandler,
			monitorFailedHandler,
			watchOption
		);
	};

	let monitorSuccessHandler = (position) => {
		updateGeoLocation(position);
	};

	let monitorFailedHandler = (err) => {
		updateStatus(`Failed monitoring geo location - ${err.code}: ${err.message}`);
	};

	let monitorOrientation = () => {
		// @ts-ignore
		DeviceOrientationEvent.requestPermission()
			.then(response => {
				if ('granted' === response) {
					console.log('orientation permission granted');
					isOrientationEnabled = true;
					window.addEventListener('deviceorientation', handleOrientation, true);
				} else {
					console.log('user denied orientation permission');
				}
			})
			.catch(console.error);
	};

	let handleOrientation = (event) => {
		//const { absolute, alpha, beta, gamma, webkitCompassHeading } = event;
		const { webkitCompassHeading } = event;
		deviceHeading = webkitCompassHeading;
	};

	let stopExperience = () => {
		updateStatus('Stopped');
		isExperienceRunning.set(false);
		navigator.geolocation.clearWatch(watchId);
		stopBgAudio();
		stopNarrativeAudio();
	};

	let updateGeoLocation = (position) => {
		if (position.coords.longitude && position.coords.latitude) {
			const { latitude, longitude } = position.coords;
			const lat = latitude;
			const lng = longitude;
			updateStatus(`Updated Location`);
			currentCoord.set({ lat, lng });
			let mapLocation = new google.maps.LatLng(lat, lng);
			updateInfoToPoints(mapLocation);
		}
	};

	let updateInfoToPoints = (position) => {
		let inEventsArea = false;
		for (let points_name in $interestPointsCoordinates) {
			const { lat, lng, radius } = $interestPointsCoordinates[points_name];
			let bearingForDirectionHint = 0;
			let directionAngel = 0;

			// Calculating distance
			let distance = google.maps.geometry.spherical.computeDistanceBetween(
				position,
				new google.maps.LatLng(lat, lng)
			);

			//Calculating bearings
			let bearing = calculateBearing($currentCoord, { lat, lng });
			bearingForDirectionHint = bearing;

			// Calculating directionAngel base on device orientation
			if (isOrientationEnabled) {
				const directionAngelRaw = calculateDirectionAngle(deviceHeading, bearing);
				directionAngel = calculateDirectionAngle(deviceHeading, bearing);
				bearingForDirectionHint = directionAngelRaw <= 0 ? 360 + directionAngelRaw : directionAngelRaw;
			} else {
				directionAngel = bearing;
			}

			let { x, y, directionHint } = mapDegreeToPoints(bearingForDirectionHint);
			x = x * distance;
			y = y * distance;

			// Store operation
			pointsData.update(d => {
				let data = { ...d };
				data[points_name] = {
					...data[points_name],
					...{
						distance: distance,
						direction: {
							bearing: bearing,
							directionAngel: directionAngel,
							x: x,
							y: y,
							directionHint: directionHint
						}
					}
				};
				return data;
			});

			if (distance <= radius && $currentPoint !== points_name) {
				updateStatus(`Entered zone ${points_name}`);
				stopBgAudio();
				pauseNarrativeAudio();
				currentPoint.set(points_name);
				playBgAudio();
				bgMusicVolume.set(0.8);
				updateBgAudioVolume();
				inEventsArea = true;
				// break;
			}
			if ($currentPoint === points_name) {
				if (distance > radius) {
					stopBgAudio();
					pauseNarrativeAudio();
					inEventsArea = false;
					updateStatus(`Left event area:${points_name}`);
					continue;
				} else if (!isBgAudioPlaying()) {
					playBgAudio();
				}
				inEventsArea = true;
			}
		}

		if (!inEventsArea && $currentPoint !== 'idle') {
			isARAvaliable = false;
			isImageGalleryAvaliable = false;
			soundHint.direction = 'idle';
			soundHint.distance = 0;
			currentPoint.set('idle');
			playBgAudio();
			bgMusicVolume.set(0.05);
			updateBgAudioVolume();
		}

		if ($currentPoint !== 'idle') {
			const data = $pointsData[$currentPoint];
			const { x, y, directionHint } = data.direction;
			soundHint.direction = directionHint;
			soundHint.distance = data.distance;
			setBgAudioPosition(x, y);
			if (data.distance < 15) {
				if (!isNarrativeAudioPlaying()) {
					console.log(`Play narrative audio ${$currentPoint} since distance is ${data.distance}`);
					updateStatus('Start playing narrative');
					playNarrativeAudio();
					narrativeVolume.set(.3);
					updateNarrativeAudioVolume();
					isImageGalleryAvaliable = true;
				}
				if (data.distance < 5 && !isARAvaliable) {
					isARAvaliable = true;
				}
				bgMusicVolume.set(.05);
				updateBgAudioVolume();
			} else {
				if (isNarrativeAudioPlaying()) {
					updateStatus('Stopped playing narrative');
					pauseNarrativeAudio();
				}
				isImageGalleryAvaliable = false;
				isARAvaliable = false;
				//bgMusicVolume.set(.8);
				const { radius } = $interestPointsCoordinates[$currentPoint];
				const { distance } = $pointsData[$currentPoint];
				const adjustedVolume = (radius - distance) / (radius / 2);
				bgMusicVolume.set(adjustedVolume);
				updateBgAudioVolume();
			}
		}
	};

	let updateStatus = (text) => {
		status = `[${getCurrentTime()}] ${text}`;
		console.log(status);
	};

	let playBgAudio = () => {
		// if (!backgroundMusicAudios[$currentPoint].audio) {
		// 	console.log('Cancel play cause background audio is null');
		// 	return;
		// }
		console.log(`Play audio for ${$currentPoint}`);
		console.log(backgroundMusicAudios);
		backgroundMusicAudios[$currentPoint].soundId = backgroundMusicAudios[$currentPoint].audio.play();
	};

	let setBgAudioPosition = (x, y, z = 0) => {
		backgroundMusicAudios[$currentPoint].audio.pos(x, y, z, backgroundMusicAudios[$currentPoint].soundId);
	};

	let updateBgAudioVolume = () => {
		// if (!backgroundMusicAudios[$currentPoint].audio) {
		// 	console.log('Cancel update volume cause background audio is null');
		// 	return;
		// }
		backgroundMusicAudios[$currentPoint].audio.volume($bgMusicVolume);
	};

	let isBgAudioPlaying = () => {
		return backgroundMusicAudios[$currentPoint].audio.playing();
	};

	let stopBgAudio = () => {
		// if (!backgroundMusicAudios[$currentPoint].audio || !isBgAudioPlaying()) {
		// 	console.log('Cancel stop cause background audio is either null or not playing');
		// 	return;
		// }
		backgroundMusicAudios[$currentPoint].audio.stop();
		backgroundMusicAudios[$currentPoint].soundId = null;
	};

	let playNarrativeAudio = () => {
		narrativeAudios[$currentPoint].soundId = narrativeAudios[$currentPoint].audio.play();
	};

	let setNarrativeAudioPosition = (x, y, z = 0) => {
		narrativeAudios[$currentPoint].audio.pos(x, y, z, narrativeAudios[$currentPoint].soundId);
	};

	let updateNarrativeAudioVolume = () => {
		narrativeAudios[$currentPoint].audio.volume($narrativeVolume);
	};

	let isNarrativeAudioPlaying = () => {
		return narrativeAudios[$currentPoint].audio.playing();
	};

	let stopNarrativeAudio = () => {
		if (!narrativeAudios[$currentPoint].audio || !isNarrativeAudioPlaying()) {
			console.log('Cancel stop cause narrative audio is either null or not playing');
			return;
		}
		narrativeAudios[$currentPoint].audio.stop();
		narrativeAudios[$currentPoint].soundId = null;
	};

	let pauseNarrativeAudio = () => {
		if (!narrativeAudios[$currentPoint].audio || !isNarrativeAudioPlaying()) {
			console.log('Cancel pause cause narrative audio is either null or not playing');
			return;
		}
		narrativeAudios[$currentPoint].audio.pause();
		narrativeAudios[$currentPoint].soundId = null;
	};

	let toggleARPanel = () => {
		isARPanelOpened = !isARPanelOpened;
	};
</script>


<div class='mt-5 flex flex-col justify-center items-center mb-3'>
	<div class='rounded bg-gray-400'><span class='m-3 text-xs'>{status}</span></div>
</div>

{#if isARPanelOpened}
	<ARPanel toggleARPanel={toggleARPanel} />
{/if}

{#if isImageGalleryAvaliable && $currentPoint != 'idle'}
	<ImageGallery toggleARPanel={toggleARPanel} isARAvaliable={isARAvaliable} />
{/if}

<div class='flex flex-col items-center justify-center '>

	<ExperienceControlPanel deviceHeading={deviceHeading}
													soundHint={soundHint}
													startExperience={startExperience}
													stopExperience={stopExperience}
													toggleARPanel={toggleARPanel}
	/>

	<hr class='m-2' />

	{#if googleLoaded}
		<Map bind:this={map} updateStatus={updateStatus} />
	{/if}

	<LocationInfoTable />
</div>
