var requirejs = require('requirejs');

requirejs.config({
	// Use node's special variable __dirname to
	// get the directory containing this file.
	// Useful if building a library that will
	// be used in node but does not require the
	// use of node outside
	baseUrl : ".",

	// Pass the top-level main.js/index.js require
	// function to requirejs so that node modules
	// are loaded relative to the top-level JS file.
	nodeRequire : require
});

requirejs([ "csp", "ac3", "backtrackingSearch", "hochzeit" ], function(csp, ac3, backtrackingSearch, data) {
	try {
		var problem = csp(data);
		problem.makeNodeConsistent();

		// ac3.solve(problem);

		backtrackingSearch(problem);

		if (problem.isSolved()) {
			if (data.formatOutput) {
				console.log(data.formatOutput(problem.getVariableDomains()))
			} else {
				console.log(problem.getVariableDomains());
			}
		} else {
			console.log("no solution");
		}

	} catch (e) {
		console.log(e.stack);
	}
});