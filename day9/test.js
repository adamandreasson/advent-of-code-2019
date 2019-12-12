function recurse(depth) {
	try {
		return recurse(depth + 1);
	} catch (ex) {
		return depth;
	}
}

console.log("hello");
var maxRecursion = recurse(1);
console.log("hello", maxRecursion);
