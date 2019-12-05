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

const inputInstruction = (program, position) => {
	program[program[position + 1]] = parseInt(process.argv[2]);
	return program;
};

const outputInstruction = (program, position, modes) => {
	const readAddress1 =
		modes.length > 0
			? modes[0] == 1
				? position + 1
				: program[position + 1]
			: program[position + 1];
	console.log("OUT:", program[readAddress1]);
	return program;
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

const processCode = (program, position) => {
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
			newProgram = inputInstruction(program, position);
			pointerMove = 2;
			break;
		case 4:
			newProgram = outputInstruction(program, position, modes);
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

	return { program: newProgram, move: pointerMove };
};

const tick = (program, position) => {
	const res = processCode(program, position);

	if (!res.program) {
		return program;
	}

	return tick(res.program, position + res.move);
};

const startProgram = [
	3,
	225,
	1,
	225,
	6,
	6,
	1100,
	1,
	238,
	225,
	104,
	0,
	1002,
	148,
	28,
	224,
	1001,
	224,
	-672,
	224,
	4,
	224,
	1002,
	223,
	8,
	223,
	101,
	3,
	224,
	224,
	1,
	224,
	223,
	223,
	1102,
	8,
	21,
	225,
	1102,
	13,
	10,
	225,
	1102,
	21,
	10,
	225,
	1102,
	6,
	14,
	225,
	1102,
	94,
	17,
	225,
	1,
	40,
	173,
	224,
	1001,
	224,
	-90,
	224,
	4,
	224,
	102,
	8,
	223,
	223,
	1001,
	224,
	4,
	224,
	1,
	224,
	223,
	223,
	2,
	35,
	44,
	224,
	101,
	-80,
	224,
	224,
	4,
	224,
	102,
	8,
	223,
	223,
	101,
	6,
	224,
	224,
	1,
	223,
	224,
	223,
	1101,
	26,
	94,
	224,
	101,
	-120,
	224,
	224,
	4,
	224,
	102,
	8,
	223,
	223,
	1001,
	224,
	7,
	224,
	1,
	224,
	223,
	223,
	1001,
	52,
	70,
	224,
	101,
	-87,
	224,
	224,
	4,
	224,
	1002,
	223,
	8,
	223,
	1001,
	224,
	2,
	224,
	1,
	223,
	224,
	223,
	1101,
	16,
	92,
	225,
	1101,
	59,
	24,
	225,
	102,
	83,
	48,
	224,
	101,
	-1162,
	224,
	224,
	4,
	224,
	102,
	8,
	223,
	223,
	101,
	4,
	224,
	224,
	1,
	223,
	224,
	223,
	1101,
	80,
	10,
	225,
	101,
	5,
	143,
	224,
	1001,
	224,
	-21,
	224,
	4,
	224,
	1002,
	223,
	8,
	223,
	1001,
	224,
	6,
	224,
	1,
	223,
	224,
	223,
	1102,
	94,
	67,
	224,
	101,
	-6298,
	224,
	224,
	4,
	224,
	102,
	8,
	223,
	223,
	1001,
	224,
	3,
	224,
	1,
	224,
	223,
	223,
	4,
	223,
	99,
	0,
	0,
	0,
	677,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1105,
	0,
	99999,
	1105,
	227,
	247,
	1105,
	1,
	99999,
	1005,
	227,
	99999,
	1005,
	0,
	256,
	1105,
	1,
	99999,
	1106,
	227,
	99999,
	1106,
	0,
	265,
	1105,
	1,
	99999,
	1006,
	0,
	99999,
	1006,
	227,
	274,
	1105,
	1,
	99999,
	1105,
	1,
	280,
	1105,
	1,
	99999,
	1,
	225,
	225,
	225,
	1101,
	294,
	0,
	0,
	105,
	1,
	0,
	1105,
	1,
	99999,
	1106,
	0,
	300,
	1105,
	1,
	99999,
	1,
	225,
	225,
	225,
	1101,
	314,
	0,
	0,
	106,
	0,
	0,
	1105,
	1,
	99999,
	108,
	677,
	677,
	224,
	102,
	2,
	223,
	223,
	1005,
	224,
	329,
	101,
	1,
	223,
	223,
	1107,
	677,
	226,
	224,
	102,
	2,
	223,
	223,
	1006,
	224,
	344,
	101,
	1,
	223,
	223,
	1107,
	226,
	226,
	224,
	102,
	2,
	223,
	223,
	1006,
	224,
	359,
	101,
	1,
	223,
	223,
	1108,
	677,
	677,
	224,
	102,
	2,
	223,
	223,
	1005,
	224,
	374,
	101,
	1,
	223,
	223,
	8,
	677,
	226,
	224,
	1002,
	223,
	2,
	223,
	1005,
	224,
	389,
	101,
	1,
	223,
	223,
	108,
	226,
	677,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	404,
	1001,
	223,
	1,
	223,
	107,
	677,
	677,
	224,
	102,
	2,
	223,
	223,
	1006,
	224,
	419,
	101,
	1,
	223,
	223,
	1007,
	226,
	226,
	224,
	102,
	2,
	223,
	223,
	1005,
	224,
	434,
	101,
	1,
	223,
	223,
	1007,
	677,
	677,
	224,
	102,
	2,
	223,
	223,
	1005,
	224,
	449,
	1001,
	223,
	1,
	223,
	8,
	677,
	677,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	464,
	101,
	1,
	223,
	223,
	1108,
	677,
	226,
	224,
	1002,
	223,
	2,
	223,
	1005,
	224,
	479,
	101,
	1,
	223,
	223,
	7,
	677,
	226,
	224,
	1002,
	223,
	2,
	223,
	1005,
	224,
	494,
	101,
	1,
	223,
	223,
	1008,
	677,
	677,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	509,
	1001,
	223,
	1,
	223,
	1007,
	226,
	677,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	524,
	1001,
	223,
	1,
	223,
	107,
	226,
	226,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	539,
	1001,
	223,
	1,
	223,
	1107,
	226,
	677,
	224,
	102,
	2,
	223,
	223,
	1005,
	224,
	554,
	101,
	1,
	223,
	223,
	1108,
	226,
	677,
	224,
	102,
	2,
	223,
	223,
	1006,
	224,
	569,
	101,
	1,
	223,
	223,
	108,
	226,
	226,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	584,
	1001,
	223,
	1,
	223,
	7,
	226,
	226,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	599,
	101,
	1,
	223,
	223,
	8,
	226,
	677,
	224,
	102,
	2,
	223,
	223,
	1005,
	224,
	614,
	101,
	1,
	223,
	223,
	7,
	226,
	677,
	224,
	1002,
	223,
	2,
	223,
	1005,
	224,
	629,
	101,
	1,
	223,
	223,
	1008,
	226,
	677,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	644,
	101,
	1,
	223,
	223,
	107,
	226,
	677,
	224,
	1002,
	223,
	2,
	223,
	1005,
	224,
	659,
	1001,
	223,
	1,
	223,
	1008,
	226,
	226,
	224,
	1002,
	223,
	2,
	223,
	1006,
	224,
	674,
	1001,
	223,
	1,
	223,
	4,
	223,
	99,
	226
];
const runComputer = () => {
	const endProgram = tick(startProgram, 0);
};

runComputer();
