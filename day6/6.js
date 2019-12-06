const getOrbitPair = line => {
	const objects = line.split(")");
	return { host: objects[0], satellite: objects[1] };
};

const findHost = (orbits, satellite) => {
	return orbits.find(o => o.satellite === satellite);
};

const countTotalOrbits = orbits => {
	let totalOrbits = 0;
	for (p in orbits) {
		const pair = orbits[p];
		let parent = pair;
		do {
			console.log("host of ", pair.host, parent);
			parent = findHost(orbits, parent.host);
			totalOrbits++;
		} while (parent);
	}
	console.log("total orbits", totalOrbits);
};

const parseInput = data => {
	const orbits = data.split("\r\n").map(line => getOrbitPair(line));
	countTotalOrbits(orbits);
};

var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	console.log("data", data);
	parseInput(data);
});
