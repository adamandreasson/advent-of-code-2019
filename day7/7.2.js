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
	//console.log("OUT [", readAddress1, "]", program[readAddress1]);
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
		//console.log("jumping to", readAddress2);
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
	//console.log("instruction", instruction, "modes", modes, "at", position);

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
			//console.log("READING FROM INPUTS ", inputs);
			newProgram = inputInstruction(program, position, inputs);
			if (inputs.length > 1) inputs = inputs.slice(1);
			pointerMove = 2;
			break;
		case 4:
			newProgram = program;
			outputs.push(outputInstruction(program, position, modes));
			pointerMove = 2;

			return {
				program: newProgram,
				move: pointerMove,
				inputs: inputs,
				outputs: outputs
			};
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
		case 9:
			newProgram = null;
	}

	return {
		program: newProgram,
		move: pointerMove,
		inputs: inputs,
		outputs: outputs
	};
};

const tick = (program, position, inputs, outputs) => {
	//console.log(JSON.stringify(program), outputs);
	const res = processCode(program, position, inputs, outputs);

	if (res.outputs.length > 0) {
		return {
			program: res.program,
			position: position + res.move,
			outputs: res.outputs
		};
	}
	if (!res.program) {
		return {
			program: program,
			position: -1,
			outputs: outputs
		};
	}

	return tick(res.program, position + res.move, res.inputs, res.outputs);
};

let startProgram = [];

const runComputer = computer => {
	//console.log(computer);
	const inputs = computer.isPhaseSet
		? [computer.input]
		: [computer.phaseSetting, computer.input];
	const endProgram = tick(computer.program, computer.pointer, inputs, []);
	computer.program = endProgram.program;
	computer.pointer = endProgram.position;
	computer.isPhaseSet = true;
	if (endProgram.outputs.length > 0) computer.output = endProgram.outputs[0];
	//console.log("computer done", computer);
	return computer;
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

const getAmplifiers = () => {
	let amps = [];
	for (let i = 0; i < 5; i++) {
		const program = [...startProgram];
		amps.push({ program: program, input: 0, output: 0, pointer: 0 });
	}
	return amps;
};

const tryCombination = combination => {
	let lastOutput = 0;
	const amplifiers = getAmplifiers();

	for (let q = 0; q < 999; q++) {
		for (let i = 0; i < 5; i++) {
			console.log("boot computer", i, combination[i], lastOutput);
			amplifiers[i].phaseSetting = combination[i];
			amplifiers[i].input = lastOutput;
			amplifiers[i] = runComputer(amplifiers[i]);
			lastOutput = amplifiers[i].output;
			if (amplifiers[i].pointer < 0) {
				console.log(amplifiers[i].input);
				return amplifiers[i].input;
			}
		}
	}

	return lastOutput;
};

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
