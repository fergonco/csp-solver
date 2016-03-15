define([ "ac3" ], function(ac3) {

	function backtrackingSearch(csp) {
		var assignments = backtrack({}, csp);
		if (assignments != null) {
			csp.setVariableDomain(assignments)
		}
	}

	function backtrack(assignments, csp) {
		var cspVariables = csp.getVariables();
		if (Object.keys(assignments).length == cspVariables.length) {
			return assignments;
		}
		var unasignedVariable = getUnasignedVariable(cspVariables, assignments);
		console.log(unasignedVariable);
		var domainValues = csp.getVariableDomain(unasignedVariable);
		for (var i = 0; i < domainValues.length; i++) {
			var value = domainValues[i];
			// array, to have the same structure as variableDomains
			assignments[unasignedVariable] = [ value ];
			var pacsp = csp.getPartiallyAssigned(assignments);
			if (pacsp.isConsistentAssignment(unasignedVariable)) {
				var inferedVariables = getInferences(pacsp, unasignedVariable);
				if (inferedVariables != null) {
					for ( var variable in inferedVariables) {
						assignments[variable] = pacsp.getVariableDomain(variable);
					}
					var result = backtrack(assignments, csp);
					if (result != null) {
						return result;
					}
					for ( var variable in inferedVariables) {
						delete assignments[variable];
					}
				}
			}
			delete assignments[unasignedVariable];
			// console.log("fail");
		}

		return null;
	}

	function getUnasignedVariable(cspVariables, assignments) {
		for (var i = 0; i < cspVariables.length; i++) {
			if (!assignments.hasOwnProperty(cspVariables[i])) {
				return cspVariables[i];
			}
		}

		throw "no assigned variables left";
	}

	function getInferences(pacsp, unasignedVariable) {
		var solvedVariables = pacsp.getSolvedVariableDomains();
		var arcs = pacsp.getArcConstraintsToExcept(unasignedVariable, null);
		ac3.solveArcs(pacsp, arcs);
		if (pacsp.noSolutionFound()) {
			return null;
		} else {
			var inferedVariables = pacsp.getSolvedVariableDomains();
			for ( var variable in solvedVariables) {
				delete inferedVariables[variable];
			}

			return inferedVariables;
		}
	}

	return backtrackingSearch;
});