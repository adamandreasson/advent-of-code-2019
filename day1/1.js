const getFuelRequired = mass => {
	const fuelMass = Math.floor(mass / 3.0) - 2;

	if (fuelMass <= 0) {
		return 0;
	}

	return fuelMass + getFuelRequired(fuelMass);
};

var fs = require("fs");
fs.readFile("1.txt", "utf8", function(err, data) {
	const lines = data.split("\n");

	let sum = 0;

	for (let l in lines) {
		const line = lines[l].replace(/\D/g, "");
		sum += getFuelRequired(line);
	}

	console.log(sum);
});
