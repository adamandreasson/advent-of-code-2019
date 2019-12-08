const addInstruction = (program, position, modes) => {
	const writeAddress = program[position + 3];
	const readAddress2 =
		modes.length > 1
			? modes[1] == "1"
				? position + 2
				: program[position + 2]
			: program[position + 2];
	const readAddress1 =
		modes.length > 0
			? modes[0] == "1"
				? position + 1
				: program[position + 1]
			: program[position + 1];
	program[writeAddress] = program[readAddress2] + program[readAddress1];
	return program;
};

const mulInstruction = (program, position, modes) => {
	const writeAddress = program[position + 3];
	const readAddress2 =
		modes.length > 1
			? modes[1] == "1"
				? position + 2
				: program[position + 2]
			: program[position + 2];
	const readAddress1 =
		modes.length > 0
			? modes[0] == "1"
				? position + 1
				: program[position + 1]
			: program[position + 1];
	program[writeAddress] = program[readAddress2] * program[readAddress1];
	return program;
};

const inputInstruction = (program, position, inputs) => {
	program[program[position + 1]] = parseInt(inputs[0]);
	return program;
};

const outputInstruction = (program, position, modes) => {
	const readAddress1 =
		modes.length > 0
			? modes[0] == 1
				? position + 1
				: program[position + 1]
			: program[position + 1];
	console.log("OUT", program[readAddress1]);
	return program[readAddress1];
};

const jumpIfTrueInstruction = (program, position, modes) => {
	const readAddress2 =
		modes.length > 1
			? modes[1] == "1"
				? position + 2
				: program[position + 2]
			: program[position + 2];
	const readAddress1 =
		modes.length > 0
			? modes[0] == "1"
				? position + 1
				: program[position + 1]
			: program[position + 1];
	if (program[readAddress1] != 0) {
		return program[readAddress2];
	}
	return 0;
};

const jumpIfFalseInstruction = (program, position, modes) => {
	const readAddress2 =
		modes.length > 1
			? modes[1] == "1"
				? position + 2
				: program[position + 2]
			: program[position + 2];
	const readAddress1 =
		modes.length > 0
			? modes[0] == "1"
				? position + 1
				: program[position + 1]
			: program[position + 1];
	if (program[readAddress1] == 0) {
		return program[readAddress2];
	}
	return 0;
};

const equalsInstruction = (program, position, modes) => {
	const writeAddress = program[position + 3];
	const readAddress2 =
		modes.length > 1
			? modes[1] == "1"
				? position + 2
				: program[position + 2]
			: program[position + 2];
	const readAddress1 =
		modes.length > 0
			? modes[0] == "1"
				? position + 1
				: program[position + 1]
			: program[position + 1];
	if (program[readAddress1] == program[readAddress2]) {
		program[writeAddress] = 1;
	} else {
		program[writeAddress] = 0;
	}
	return program;
};

const lessThanInstruction = (program, position, modes) => {
	const writeAddress = program[position + 3];
	const readAddress2 =
		modes.length > 1
			? modes[1] == "1"
				? position + 2
				: program[position + 2]
			: program[position + 2];
	const readAddress1 =
		modes.length > 0
			? modes[0] == "1"
				? position + 1
				: program[position + 1]
			: program[position + 1];
	if (program[readAddress1] < program[readAddress2]) {
		program[writeAddress] = 1;
	} else {
		program[writeAddress] = 0;
	}
	return program;
};

const processCode = (program, position, inputs, outputs) => {
	const instruction = program[position];

	let pointerMove = 1;
	let newProgram = false;

	const instructionParts = instruction
		.toString()
		.split("")
		.reverse();
	const instructionCode = parseInt(instructionParts[0]);
	const modes = instructionParts.splice(2);
	let target = 0;
	console.log("instruction", instruction, "modes", modes);

	switch (instructionCode) {
		case 1:
			newProgram = addInstruction(program, position, modes);
			pointerMove = 4;
			break;
		case 2:
			newProgram = mulInstruction(program, position, modes);
			pointerMove = 4;
			break;
		case 3:
			console.log("READING FROM INPUTS ", inputs);
			newProgram = inputInstruction(program, position, inputs);
			if (inputs.length > 1) inputs = inputs.slice(1);
			pointerMove = 2;
			break;
		case 4:
			newProgram = program;
			console.log("ADDING OUTPUT ");
			outputs.push(outputInstruction(program, position, modes));
			pointerMove = 2;
			break;
		case 5:
			newProgram = program;
			target = jumpIfTrueInstruction(program, position, modes);
			pointerMove = target > 0 ? target - position : 3;
			break;
		case 6:
			newProgram = program;
			target = jumpIfFalseInstruction(program, position, modes);
			pointerMove = target > 0 ? target - position : 3;
			break;
		case 7:
			newProgram = lessThanInstruction(program, position, modes);
			pointerMove = 4;
			break;
		case 8:
			newProgram = equalsInstruction(program, position, modes);
			pointerMove = 4;
			break;
	}

	return {
		program: newProgram,
		move: pointerMove,
		inputs: inputs,
		outputs: outputs
	};
};

const tick = (program, position, inputs, outputs) => {
	console.log(JSON.stringify(program), outputs);
	const res = processCode(program, position, inputs, outputs);

	if (!res.program) {
		return outputs;
	}

	return tick(res.program, position + res.move, res.inputs, res.outputs);
};

let startProgram = [];

const runComputer = (phaseSetting, input) => {
	console.log(phaseSetting, input);
	const program = [...startProgram];
	const endProgram = tick(program, 0, [phaseSetting, input], []);
	console.log("computer done", endProgram);
	return endProgram[endProgram.length - 1];
};

//shamelessly stolen function from SO
const permutator = inputArr => {
	let result = [];

	const permute = (arr, m = []) => {
		if (arr.length === 0) {
			result.push(m);
		} else {
			for (let i = 0; i < arr.length; i++) {
				let curr = arr.slice();
				let next = curr.splice(i, 1);
				permute(curr.slice(), m.concat(next));
			}
		}
	};

	permute(inputArr);

	return result;
};

const generatePhaseCombinations = () => {
	return permutator([5, 6, 7, 8, 9]);
};

const tryCombination = combination => {
	let lastOutput = 0;

	for (let i = 0; i < 5; i++) {
		console.log("boot computer", i % 5, combination[i % 5], lastOutput);
		let phaseSetting = combination[i % 5];
		lastOutput = runComputer(phaseSetting, lastOutput);
	}

	return lastOutput;
};

var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	console.log("data", data);
	startProgram = JSON.parse("[" + data + "]");

	const result = tryCombination([9, 8, 7, 6, 5]);
	console.log(result);
});

/*
var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	console.log("data", data);
	startProgram = JSON.parse("[" + data + "]");

	const combinations = generatePhaseCombinations();

	let highestResult = 0;
	let bestCombination = null;

	for (let c in combinations) {
		const combination = combinations[c];
		const result = tryCombination(combination);
		if (result > highestResult) {
			highestResult = result;
			bestCombination = combination;
		}
	}
	console.log(bestCombination);
	console.log(highestResult);
});
*/
