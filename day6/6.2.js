const getOrbitPair = line => {
	const objects = line.split(")");
	return { host: objects[0], satellite: objects[1] };
};

const findHost = (orbits, satellite) => {
	return orbits.find(o => o.satellite === satellite);
};

const traceOrbit = (orbits, name) => {
	const orbit = orbits.find(o => o.satellite == name);

	let trace = [orbit];
	let parent = orbit;
	do {
		console.log("host of ", orbit.host, parent);
		parent = findHost(orbits, parent.host);
		if (parent) trace.push(parent);
	} while (parent);

	return trace;
};

const traceImportantOrbits = orbits => ({
	you: traceOrbit(orbits, "YOU"),
	santa: traceOrbit(orbits, "SAN")
});

const findClosestCommonHost = traces => {
	for (let i in traces.you) {
		const host = traces.you[i].host;
		const commonDen = traces.santa.find(orbit => orbit.host == host);
		if (commonDen) {
			return commonDen;
		}
	}

	return null;
};

const findLengthToCommonHost = (trace, commonHost) => {
	for (let i = 0; i < trace.length; i++) {
		if (trace[i].host == commonHost.host) {
			return i;
		}
	}
	return 0;
};

const parseInput = data => {
	const orbits = data.split("\r\n").map(line => getOrbitPair(line));
	const traces = traceImportantOrbits(orbits);
	const closestCommonHost = findClosestCommonHost(traces);
	console.log(traces);
	console.log(
		closestCommonHost,
		traces.you.find(o => o.host == closestCommonHost.host),
		traces.santa.find(o => o.host == closestCommonHost.host),
		findLengthToCommonHost(traces.you, closestCommonHost),
		findLengthToCommonHost(traces.santa, closestCommonHost),
		findLengthToCommonHost(traces.you, closestCommonHost) +
			findLengthToCommonHost(traces.santa, closestCommonHost)
	);
};

var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	console.log("data", data);
	parseInput(data);
});
