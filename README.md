# Rings of Time

Mixed Reality (COMP4036) student Project
This project is for study purpose only

[Demo Video](https://www.youtube.com/watch?v=ybjxVWg2Ifo)

[Live Demo Web App](https://rings-of-time.vercel.app)

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

## References

| Name | Author | Source |
|-- | --|-- |
| Castle Model | GSXNet | https://sketchfab.com/3d-models/harlech-castle-wales-unesco-world-heritage-201f29ff3c1a49adb3d97bb7dd7ff043 |
| Castle Model | R0m1R | https://sketchfab.com/3d-models/hrusov-castle-993f6d456a434490b7ad3b9456b97a19 |
| Image | | https://www.bbc.co.uk/news/uk-england-nottinghamshire-24725569 |
| Image | | https://www.bbc.co.uk/news/uk-england-nottinghamshire-57490256 |
| Image | | https://www.nottinghampost.com/news/nottingham-news/night-nottingham-castle-burnt-down-4107964 |
| Image | | https://fineartamerica.com/featured/robin-hood-outside-nottingham-castle-angus-mcbride.html |
| Image | | https://artuk.org/discover/artworks/nottingham-castle-gateway-46284 |
| Image | | https://artuk.org/shop/image-library/licensed-image/poster/nottingham-castle-on-fire-1831-47372/posterid/47372.html |
| Image |  | https://www.medievalists.net/2011/01/the-siege-of-nottingham-castle-in-1194/charles_i_standard/ |
| Image |  | https://artuk.org/shop/image-library/licensed-image/poster/view-of-nottingham-castle-with-st-nicholas-church-and-houses-47505/posterid/47505.html |
| Image |  | https://artuk.org/discover/artworks/nottingham-castle-47251 |
| Narrative Audio | TheDocumentaryZone | https://www.youtube.com/watch?v=kAj9raQuaGg |
| Narrative Audio | University of Nottingham | https://www.youtube.com/watch?v=2uPYmhdDu0Y |
| Background Music | Kopukostar | https://www.youtube.com/watch?v=INJR-VaDVFs |
| Background Music | Hilary Hahn | https://www.youtube.com/watch?v=iEBX_ouEw1I |
| Background Music | Joel Sunny Violin | https://www.youtube.com/watch?v=j-QeBhOXPf8 |
