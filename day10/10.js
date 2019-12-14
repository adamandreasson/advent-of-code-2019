const isAsteroidAt = (map, x, y) => map[y][x];

const isBlockingLine = (x1, y1, x2, y2, obstacleX, obstacleY) => {
	if (x2 == x1) {
		if (obstacleX != x1) return false;
		return (
			(y2 < obstacleY && obstacleY < y1) || (y2 > obstacleY && obstacleY > y1)
		);
	}
	if (y2 == y1) {
		if (obstacleY != y1) return false;
		return (
			(x2 < obstacleX && obstacleX < x1) || (x2 > obstacleX && obstacleX > x1)
		);
	}
	const alphaX = (obstacleX - x1) / (x2 - x1);
	const alphaY = (obstacleY - y1) / (y2 - y1);
	//console.log(x1, y1, x2, y2, obstacleX, obstacleY, alphaX, alphaY);
	if (alphaX != alphaY) return false;

	if (alphaX < 0 || alphaY < 0 || alphaX > 1 || alphaY > 1) return false;
	return true;
};

const isPathClear = (map, x1, y1, x2, y2) => {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (isAsteroidAt(map, x, y)) {
				if ((x1 == x && y1 == y) || (x2 == x && y2 == y)) continue;
				const blocked = isBlockingLine(x1, y1, x2, y2, x, y);
				if (blocked) {
					//console.log("blocked!", x1, y1, x2, y2, x, y);
				}
				if (blocked) return false;
			}
		}
	}
	return true;
};

const getVisibleAsteroids = (map, stationX, stationY) => {
	let visibleAsteroids = [];
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			//if (stationX != 1 || stationY != 0) continue;
			if (stationX == x && stationY == y) continue;
			if (isAsteroidAt(map, x, y)) {
				if (isPathClear(map, stationX, stationY, x, y)) {
					visibleAsteroids.push({ x: x, y: y });
					//		console.log("adding visible ", stationX, stationY, { x: x, y: y });
				} else {
					//		console.log("not visible ", stationX, stationY, { x: x, y: y });
				}
			}
		}
	}

	return visibleAsteroids;
};

const printVisibleAsteroidMap = (map, asteroid) => {
	let stringBuilder = "";
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (asteroid.x == x && asteroid.y == y) {
				stringBuilder += "O";
				continue;
			}
			let asteroidFound = false;
			for (let i in asteroid.visible) {
				const otherAsteroid = asteroid.visible[i];
				if (otherAsteroid.x == x && otherAsteroid.y == y) {
					asteroidFound = true;
					break;
				}
			}
			stringBuilder += asteroidFound ? "#" : ".";
		}
		stringBuilder += "\n";
	}
	console.log(stringBuilder);
};

const processMap = map => {
	let asteroids = [];
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (isAsteroidAt(map, x, y)) {
				asteroids.push({
					x: x,
					y: y,
					visible: getVisibleAsteroids(map, x, y)
				});
			}
		}
	}
	for (let a in asteroids) {
		console.log(asteroids[a].visible.length);
		printVisibleAsteroidMap(map, asteroids[a]);
	}

	asteroids.sort((a, b) => (a.visible.length < b.visible.length ? 1 : -1));
	console.log(asteroids[0], asteroids[0].visible.length);
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
