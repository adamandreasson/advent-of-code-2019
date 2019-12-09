const width = 25;
const height = 6;

const readImage = data => {
	const pixelsPerLayer = width * height;
	const numOfLayers = data.length / pixelsPerLayer;
	console.log(data.length, numOfLayers);

	let layers = [];
	for (let layer = 0; layer < numOfLayers; layer++) {
		let layerComposition = {};
		for (let i = 0; i < pixelsPerLayer; i++) {
			const pixelIndex = layer * pixelsPerLayer + i;
			if (layerComposition[data[pixelIndex]]) {
				layerComposition[data[pixelIndex]]++;
			} else {
				layerComposition[data[pixelIndex]] = 1;
			}
		}
		layers[layer] = layerComposition;
	}

	layers.sort((a, b) => (a["0"] < b["0"] ? 1 : -1));
	console.log(layers);
};

var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	readImage(data);
});
