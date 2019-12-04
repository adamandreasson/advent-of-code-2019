const MIN = 178416;
const MAX = 676461;

const hasAdjacent = string => {
	for (let i = 0; i < string.length; i++) {
		if (i + 1 == string.length) break;
		if (string[i] === string[i + 1]) {
			return true;
		}
	}
	return false;
};

const isIncreasing = string => {
	for (let i = 0; i < string.length; i++) {
		if (i + 1 == string.length) break;
		if (string[i] > string[i + 1]) {
			return false;
		}
	}
	return true;
};

const isMatch = number => {
	const string = number.toString();
	if (!hasAdjacent(string)) {
		return false;
	}
	if (!isIncreasing(string)) {
		return false;
	}
	return true;
};

let matches = [];

for (let i = MIN; i <= MAX; i++) {
	if (isMatch(i)) {
		matches.push(i);
	}
}

console.log(matches);
console.log(matches.length);
