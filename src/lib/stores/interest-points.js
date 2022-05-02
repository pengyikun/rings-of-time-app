import { writable, readable } from 'svelte/store';

export const interestPointsCoordinates = readable({
	entrance: { lat: 52.950246, lng: -1.153925, radius: 25 },
	1: { lat: 52.94979, lng: -1.15340, radius: 35 },
	2: { lat: 52.94979, lng: -1.15467, radius: 40 }
});


export const interestPointsInfo = readable({
	'entrance': {
		name: 'Norman Beginnings',
		narrativeContent: 'In the years after the Norman Conquest in 1066, William, now King of England, began to assert his control over his new territory. He decided to build Nottingham Castle in 1068 – constructing a wooden motte-and-bailey castle.\n' +
			'\n' +
			'Within 100 years a bloody civil war, The Anarchy, had broken out and Nottingham Castle was held by supporters of King Stephen. The Castle was besieged by Robert of Gloucester, Empress Matilda’s half-brother, and when Robert couldn’t capture the Castle, he plundered the town.'
	},
	'1': {
		name: 'The Wars of the Roses',
		narrativeContent: 'Neither Henry V nor his son Henry VI showed much interest in Nottingham, but in 1461, 18-year-old Edward, the Yorkist Earl of March, proclaimed himself King at Nottingham Castle during the Wars of the Roses. Later that year, after defeating both Jasper Tudor’s Lancastrian army and Henry VI’s forces, Edward was crowned king in Westminster Abbey. Edward appointed his brother, Richard, Duke of Gloucester – later Richard III – the commander of his armies in the north. These armies were based at Nottingham.'
	},
	'2': {
		name: 'From rebuilding to Bosworth',
		narrativeContent: 'Between 1476 and 1480 Edward spent lavishly on Nottingham Castle, adding new comfortable State Apartments in the Middle Bailey and a defensive six-sided tower, known as Richard’s Tower. After Edward’s death, Richard devised a bloody path to the throne that involved killing off several family members. It was from his ‘Castle of care’ at Nottingham that Richard would raise his standard and depart for the Battle of Bosworth in 1485. At Bosworth, Richard, the last of the Plantagenets, was killed by the Lancastrians. They were led by Jasper Tudor’s nephew, Henry, who would become Henry VII, the first Tudor king.'
	}
});


export const isExperienceRunning = writable(false);
export const currentPoint = writable('1');
export const currentCoord = writable({ lat: 52.94772, lng: -1.14579 });
export const pointsData = writable({});


export const bgMusicVolume = writable(0.9);
export const narrativeVolume = writable(.3);


export const imageData = readable({
	1: [
		'1', '2', '3'
	],
	2: [
		'4', '5', '6'
	],
	'entrance': [
		'7', '8', '9'
	]
});