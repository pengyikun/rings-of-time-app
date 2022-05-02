export const calculateBearing = (i, t) => {
	const i_lat = i.lat;
	const i_lng = i.lng;
	const t_lat = t.lat;
	const t_lng = t.lng;
	const y = Math.sin(t_lng - i_lng) * Math.cos(t_lat);
	const x =
		Math.cos(i_lat) * Math.sin(t_lat) - Math.sin(i_lat) * Math.cos(t_lat) * Math.cos(t_lng - i_lng);
	const bearing = (Math.atan2(y, x) * 180) / Math.PI;
	return 360 - ((bearing + 360) % 360);
};

export const calculateDirectionAngle = (i, t) => {
	let diff = t - i;
	return ((diff + 180) % 360) - 180;
};

export const calculate2DPos = (distance, angel) => {
	return {
		x: distance * Math.cos((angel * Math.PI) / 180),
		y: distance * Math.sin((angel * Math.PI) / 180)
	};
};

export const mapDegreeToPoints = (degree) => {
	if (degree === 0) {
		return { x: 0, y: 1, directionHint: 'Forward' };
	} else if (degree <= 45) {
		return { x: 1, y: 1, directionHint: 'Top Right' };
	} else if (degree <= 90) {
		return { x: 1, y: 0, directionHint: 'Right' };
	} else if (degree <= 135) {
		return { x: 1, y: -1, directionHint: 'Bottom Right' };
	} else if (degree <= 180) {
		return { x: 0, y: -1, directionHint: 'Backward' };
	} else if (degree <= 225) {
		return { x: -1, y: -1, directionHint: 'Bottom Left' };
	} else if (degree <= 270) {
		return { x: -1, y: 0, directionHint: 'Left' };
	} else if (degree <= 315) {
		return { x: -1, y: 1, directionHint: 'Top Left' };
	} else if (degree <= 360) {
		return { x: -1, y: 1, directionHint: 'Top Left' };
	} else {
		return { x: 0, y: 0, directionHint: 'Forward' };
	}
};
