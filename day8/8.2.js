const width = 25;
const height = 6;

const readImage = data => {
	const pixelsPerLayer = width * height;
	const numOfLayers = data.length / pixelsPerLayer;
	console.log(data.length, numOfLayers);

	let finalImage = [];
	for (let pixel = 0; pixel < pixelsPerLayer; pixel++) {
		for (let layer = numOfLayers - 1; layer >= 0; layer--) {
			const pixelIndex = layer * pixelsPerLayer + pixel;
			if (data[pixelIndex] < 2) {
				finalImage[pixel] = data[pixelIndex];
			}
		}
	}

	let stringBuilder = "";
	let i = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (finalImage[i] == "1") {
				stringBuilder += "\x1b[33m▊";
			} else {
				stringBuilder += "\x1b[30m▊";
			}
			i++;
		}
		stringBuilder += "\n";
	}
	console.log(stringBuilder + "\x1b[0m");
};

var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	readImage(data);
});
