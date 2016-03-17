define([ "ac3" ], function(ac3) {

	function backtrackingSearch(csp) {
		var assignments = backtrack(csp);
		if (assignments != null) {
			csp.setVariableDomains(assignments)
		}
	}

	function backtrack(csp) {
		if (csp.isSolved()) {
			return csp.getVariableDomains();
		}
		var unasignedVariable = csp.getUnsolvedVariables()[0];
		console.log(unasignedVariable);
		var domainValues = csp.getVariableDomain(unasignedVariable);
		for (var i = 0; i < domainValues.length; i++) {
			var value = domainValues[i];
			var pacsp = csp.clone();
			pacsp.setVariableDomain(unasignedVariable, [ value ]);

			if (pacsp.isConsistentAssignment(unasignedVariable)) {
				if (makeArcConsistent(pacsp, unasignedVariable)) {
					var result = backtrack(pacsp);
					if (result != null) {
						return result;
					}
				}
			}
		}

		return null;
	}

	function makeArcConsistent(pacsp, variable) {
		var arcs = pacsp.getArcConstraintsToExcept(variable, null);
		return ac3.solveArcs(pacsp, arcs);
	}
	
	return backtrackingSearch;
});