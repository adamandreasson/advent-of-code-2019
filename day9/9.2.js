const getAddress = (modes, program, position, relativeBase, modeIndex) => {
	if (modes.length <= modeIndex) {
		return program[position + modeIndex + 1];
	}
	if (modes[modeIndex] == "1") {
		return position + modeIndex + 1;
	}
	if (modes[modeIndex] == "2") {
		return program[position + modeIndex + 1] + relativeBase;
	}
	return program[position + modeIndex + 1];
};

const getLiteralAddress = (
	modes,
	program,
	position,
	relativeBase,
	modeIndex
) => {
	if (modes.length <= modeIndex) {
		return program[position + modeIndex + 1];
	}
	if (modes[modeIndex] == "2") {
		return program[position + modeIndex + 1] + relativeBase;
	}
	return program[position + modeIndex + 1];
};

const addInstruction = (program, position, modes, relativeBase) => {
	const writeAddress = getLiteralAddress(
		modes,
		program,
		position,
		relativeBase,
		2
	);
	const readAddress2 = getAddress(modes, program, position, relativeBase, 1);
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;
	if (!program[readAddress2]) program[readAddress2] = 0;

	program[writeAddress] = program[readAddress2] + program[readAddress1];
	return program;
};

const mulInstruction = (program, position, modes, relativeBase) => {
	const writeAddress = getLiteralAddress(
		modes,
		program,
		position,
		relativeBase,
		2
	);
	const readAddress2 = getAddress(modes, program, position, relativeBase, 1);
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;
	if (!program[readAddress2]) program[readAddress2] = 0;

	program[writeAddress] = program[readAddress2] * program[readAddress1];
	return program;
};

const inputInstruction = (program, position, inputs, modes, relativeBase) => {
	const writeAddress = getLiteralAddress(
		modes,
		program,
		position,
		relativeBase,
		0
	);
	program[writeAddress] = parseInt(inputs[0]);
	return program;
};

const outputInstruction = (program, position, modes, relativeBase) => {
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;
	console.log("OUT [", readAddress1, "]", program[readAddress1]);
	return program[readAddress1];
};

const jumpIfTrueInstruction = (program, position, modes, relativeBase) => {
	const readAddress2 = getAddress(modes, program, position, relativeBase, 1);
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;
	if (!program[readAddress2]) program[readAddress2] = 0;

	if (program[readAddress1] != 0) {
		return program[readAddress2];
	}
	return -1;
};

const jumpIfFalseInstruction = (program, position, modes, relativeBase) => {
	const readAddress2 = getAddress(modes, program, position, relativeBase, 1);
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;
	if (!program[readAddress2]) program[readAddress2] = 0;

	if (program[readAddress1] == 0) {
		return program[readAddress2];
	}
	return -1;
};

const equalsInstruction = (program, position, modes, relativeBase) => {
	const writeAddress = getLiteralAddress(
		modes,
		program,
		position,
		relativeBase,
		2
	);
	const readAddress2 = getAddress(modes, program, position, relativeBase, 1);
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;
	if (!program[readAddress2]) program[readAddress2] = 0;

	if (program[readAddress1] == program[readAddress2]) {
		program[writeAddress] = 1;
	} else {
		program[writeAddress] = 0;
	}
	return program;
};

const lessThanInstruction = (program, position, modes, relativeBase) => {
	const writeAddress = getLiteralAddress(
		modes,
		program,
		position,
		relativeBase,
		2
	);
	const readAddress2 = getAddress(modes, program, position, relativeBase, 1);
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;
	if (!program[readAddress2]) program[readAddress2] = 0;

	if (program[readAddress1] < program[readAddress2]) {
		program[writeAddress] = 1;
	} else {
		program[writeAddress] = 0;
	}
	return program;
};

const adjustRelativeInstruction = (program, position, modes, relativeBase) => {
	const readAddress1 = getAddress(modes, program, position, relativeBase, 0);
	if (!program[readAddress1]) program[readAddress1] = 0;

	return program[readAddress1];
};

const processCode = (program, position, inputs, outputs, relativeBase) => {
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

	if (instruction == 99) {
		return {
			program: newProgram,
			move: pointerMove,
			inputs: inputs,
			outputs: outputs,
			relativeBase: relativeBase
		};
	}

	switch (instructionCode) {
		case 1:
			newProgram = addInstruction(program, position, modes, relativeBase);
			pointerMove = 4;
			break;
		case 2:
			newProgram = mulInstruction(program, position, modes, relativeBase);
			pointerMove = 4;
			break;
		case 3:
			newProgram = inputInstruction(
				program,
				position,
				inputs,
				modes,
				relativeBase
			);
			if (inputs.length > 1) inputs = inputs.slice(1);
			pointerMove = 2;
			break;
		case 4:
			newProgram = program;
			outputs.push(outputInstruction(program, position, modes, relativeBase));
			pointerMove = 2;
			break;
		case 5:
			newProgram = program;
			target = jumpIfTrueInstruction(program, position, modes, relativeBase);
			pointerMove = target > -1 ? target - position : 3;
			break;
		case 6:
			newProgram = program;
			target = jumpIfFalseInstruction(program, position, modes, relativeBase);
			pointerMove = target > -1 ? target - position : 3;
			break;
		case 7:
			newProgram = lessThanInstruction(program, position, modes, relativeBase);
			pointerMove = 4;
			break;
		case 8:
			newProgram = equalsInstruction(program, position, modes, relativeBase);
			pointerMove = 4;
			break;
		case 9:
			newProgram = program;
			relativeBase += adjustRelativeInstruction(
				program,
				position,
				modes,
				relativeBase
			);
			pointerMove = 2;
			break;
	}

	return {
		program: newProgram,
		move: pointerMove,
		inputs: inputs,
		outputs: outputs,
		relativeBase: relativeBase
	};
};

const tick = (program, position, inputs, outputs, relativeBase) => {
	//console.log(JSON.stringify(program), outputs, relativeBase);
	const res = processCode(program, position, inputs, outputs, relativeBase);
	return res;
};

let startProgram = [];

const runComputer = computer => {
	console.log(computer);
	const inputs = computer.isPhaseSet
		? [computer.input]
		: [computer.phaseSetting, computer.input];
	let keepRunning = true;
	let res = tick(
		computer.program,
		computer.pointer,
		inputs,
		[],
		computer.relativeBase
	);
	let position = 0;
	while (keepRunning) {
		if (!res.program) {
			keepRunning = false;
			break;
		}

		position = position + res.move;
		res = tick(
			res.program,
			position,
			res.inputs,
			res.outputs,
			res.relativeBase
		);
	}
	const endProgram = res;
	console.log("ITS ALL OVER");
	console.log(endProgram);
	computer.program = endProgram.program;
	computer.pointer = endProgram.position;
	computer.isPhaseSet = true;
	if (endProgram.outputs.length > 0) computer.output = endProgram.outputs;
	console.log("computer done", computer);
	return computer;
};

var fs = require("fs");
fs.readFile("input.txt", "utf8", function(err, data) {
	console.log("data", data);
	startProgram = JSON.parse("[" + data + "]");
	const program = [...startProgram];

	runComputer({
		program: program,
		input: 2,
		output: 0,
		pointer: 0,
		relativeBase: 0,
		isPhaseSet: true
	});
});
