const isAsteroidAt = (map, x, y) => map[y][x];

const getAsteroidAngles = (map, stationX, stationY) => {
	let asteroidAngles = [];
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (stationX == x && stationY == y) continue;
			if (isAsteroidAt(map, x, y)) {
				let angle =
					(Math.atan2(y - stationY, x - stationX) * 180) / Math.PI + 90;
				if (angle < 0) {
					angle = 360 + angle;
				}
				asteroidAngles.push({ x: x, y: y, angle: angle });
			}
		}
	}

	return asteroidAngles;
};

const HOME_X = 37;
const HOME_Y = 25;

const getDistance = a =>
	(a.x - HOME_X) * (a.x - HOME_X) + (a.y - HOME_Y) * (a.y - HOME_Y);

const asteroidSorting = (a, b) => {
	return a.angle >= b.angle
		? a.angle == b.angle
			? getDistance(a) < getDistance(b)
				? 1
				: -1
			: -1
		: 1;
};

const processMap = map => {
	const asteroids = getAsteroidAngles(map, HOME_X, HOME_Y);

	asteroids.sort(asteroidSorting);
	console.log(asteroids);

	let vaporized = [];

	let i = asteroids.length;
	let rotationNumber = 0;
	while (asteroids.length > 0) {
		i--;
		if (i < 0) {
			i = asteroids.length - 1;
			rotationNumber++;
		}

		const asteroid = asteroids[i];

		if (
			vaporized.length > 0 &&
			asteroid.angle == vaporized[vaporized.length - 1].angle &&
			vaporized[vaporized.length - 1].rotation == rotationNumber
		) {
			continue;
		}
		vaporized.push({ ...asteroid, rotation: rotationNumber });
		asteroids.splice(i, 1);
	}
	console.log(vaporized);
	for (let i = 0; i < Math.ceil(vaporized.length / 9); i++) {
		printTraceMap(map, vaporized.slice(i * 9, (i + 1) * 9));
	}
	console.log(vaporized[199]);
};

const printTraceMap = (map, destroyedAsteroids) => {
	let stringBuilder = "";
	let index = 0;
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			let asteroidFound = false;
			for (let i = 0; i < destroyedAsteroids.length; i++) {
				const otherAsteroid = destroyedAsteroids[i];
				if (otherAsteroid.x == x && otherAsteroid.y == y) {
					asteroidFound = true;
					index = i + 1;
					break;
				}
			}
			stringBuilder += asteroidFound
				? index
				: isAsteroidAt(map, x, y)
				? "#"
				: ".";
		}
		stringBuilder += "\n";
	}
	console.log(stringBuilder);
};

var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	let map = [];
	const lines = data.split("\r\n");
	for (l in lines) {
		const line = lines[l].split("");
		map.push(line.map(c => (c === "." ? false : true)));
	}

	processMap(map);
});
