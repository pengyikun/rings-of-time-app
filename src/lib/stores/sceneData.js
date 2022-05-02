import { readable } from 'svelte/store';

export const templateHTML = readable(`<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8' />
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />
    <title>GeoAR.js demo</title>
    <script src='https://aframe.io/releases/1.3.0/aframe.min.js'></script>
    <script src='https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js'></script>
    <script src='https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js'></script>
  </head>

  <body>
    <a-scene
      vr-mode-ui='enabled: false'
      arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false;'
    >
			<a-entity position='0 0 0' scale='MODEL_SCALES_ENTRANCE' gltf-model='MODEL_LINK_ENTRANCE' look-at='[gps-camera]' gps-entity-place='latitude: &LAT_ENTRANCE&; longitude: &LNG_ENTRANCE&;'>
			</a-entity>
			<a-entity position='0 0 0' scale='MODEL_SCALES_1' gltf-model='MODEL_LINK_1' look-at='[gps-camera]' gps-entity-place='latitude: &LAT_1&; longitude: &LNG_1&;'>
			</a-entity>
			<a-entity position='0 0 0' scale='MODEL_SCALES_2' gltf-model='MODEL_LINK_2' look-at='[gps-camera]' gps-entity-place='latitude: &LAT_2&; longitude: &LNG_2&;'>
			</a-entity>
      <a-camera gps-camera rotation-reader> </a-camera>
    </a-scene>
  </body>
</html>`);


export const modelLinks = readable({
	entrance: {
		path: 'gltf/castle1/scene.gltf',
		scale: 0.5
	},
	1: {

		path: 'gltf/castle2/scene.gltf',
		scale: 0.02
	},
	2: {
		path: 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf',
		scale: 0.05
	}
});
