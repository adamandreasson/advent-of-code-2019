const MIN = 178416;
const MAX = 676461;

const hasDoubleAdjacent = string => {
	for (let i = 0; i < string.length; i++) {
		// no point checking if we are at end of string
		if (i + 1 == string.length) break;

		// this is a double
		if (string[i] === string[i + 1]) {
			//if this is potentially the last double, either it is a double (true) or a triple+ (return false)
			if (i + 2 == string.length) {
				return string[i] !== string[i - 1];
			}

			// if the following two numbers are both the same, this aint a double, keep searching
			if (string[i] === string[i + 1] && string[i] === string[i + 2]) {
				continue;
			}

			// if the previous number and the next number is the same, this aint a double, keep searching
			if (i > 0 && string[i] === string[i + 1] && string[i] === string[i - 1]) {
				continue;
			}

			// if we came all this way, this is actually a double
			return true;
		}
	}

	// by default no doubles were found
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
	if (!hasDoubleAdjacent(string)) {
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

console.log(matches.length);
