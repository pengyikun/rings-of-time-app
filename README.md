# Rings of Time

Mixed Reality (COMP4036) student Project
This project is for study purpose only

## Usage
1. Run `npm install` to install required libs

2. Open `src/lib/components/Experience.svelte`

3. Navigate to line 3,  Replace  `GOOGLE_MAP_API_KEY` with your own Google Maps API Key

>  It is **recommanded to deploy the app** first by using service like Vercel or Heroku, you can then test the app by go to the deployed app website. 
>
> You can also test the app locally by running `npm run dev` and go to `localhost:3000` in browser, however, the accuracy of geolocation is quite low under wifi network. 

### Testing

To ensure the quality of the user experience, please ensure you have the following settings configured before testing

- To enable spatial audio function, you must using device that has gyroscope sensor (e.g. mobile phones)
- For accurate geolocation detection, Use celluar data instead of WiFi
- Set the following permission to true for your browser
	- GPS location
	- Camera
	- Gyroscope (if indicates in the settigns panel)
- Wear headset/earphone that supports stereo sound (already supported by almost all of the earphone)

## Custom interest point coordinates

You can configure interest point coordinates if you are willing to test the app at the location other than Nottingham Castle

1. Open `src/lib/stores/interest-points.js`
2. Modify the data in `interestPointsCoordinates` (line 3)