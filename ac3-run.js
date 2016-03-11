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

requirejs([ "csp", "ac3" ], function(csp, ac3) {

	var domain = [ "r1", "r2" ];
	csp.addVariable("a", domain.slice());
	csp.addVariable("b", [ "r2" ]);
	csp.addVariable("c", domain.slice());
	csp.addVariable("d", domain.slice());
	csp.addVariable("e", domain.slice());
	csp.addVariable("f", domain.slice());
	csp.addVariable("g", domain.slice());
	csp.addVariable("h", domain.slice());
	csp.addArcConstraint("b", "a", function(a, b) {
		return a == b;
	});
	csp.addArcConstraint("c", "a", function(a, b) {
		return a == b;
	});
	csp.addArcConstraint("d", "a", function(a, b) {
		return a == b;
	});
	csp.addArcConstraint("e", "a", function(a, b) {
		return a == b;
	});
	var roomList = [ "r1", "r2" ];
	var roomSizes = [];
	roomSizes["r1"] = 4;
	roomSizes["r2"] = 5;
	csp.addGlobalConstraint(function(variableDomain) {
		console.log("checking room sizes");
		var acums = [];
		for ( var variable in variableDomain) {
//			console.log("checking " + variable);
			var domain = variableDomain[variable];

			var canBePlaced = false;
			for (var j = 0; j < domain.length; j++) {
				var room = domain[j];
//				console.log("suppose room " + room);

				if (!(room in acums)) {
					acums[room] = 0;
				}
				if (acums[room] < roomSizes[room]) {
					acums[room]++;
					var canBePlaced = true;
//					console.log("still fits");
					break;
				}
			}
			if (!canBePlaced){
//				console.log("none could fit");
				return false;
			}
		}
		return true;
	});
	ac3(csp);

	console.log(csp.getVariableDomains());
});