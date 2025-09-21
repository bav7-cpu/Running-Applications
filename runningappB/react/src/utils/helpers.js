export function calculateSpeed(distance, duration) {
	if (!distance || !duration) return "";

	const [hours, minutes, seconds] = duration.split(":").map(Number);

	if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return "";

	const totalHours = hours + minutes / 60 + seconds / 3600;
	const speed = totalHours > 0 ? (distance / totalHours).toFixed(2) : 0;

	return speed;
}
