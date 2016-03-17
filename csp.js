define(function() {

	function getBidirectionalArcs(arc) {
		return [ {
			"getFirst" : function() {
				return arc.v1;
			},
			"getSecond" : function() {
				return arc.v2;
			},
			"getFunction" : function() {
				return arc.f;
			}
		}, {
			"getFirst" : function() {
				return arc.v2;
			},
			"getSecond" : function() {
				return arc.v1;
			},
			"getFunction" : function() {
				return function(a, b) {
					return arc.f(b, a);
				};
			}

		} ];
	}

	function allGlobalConstraints(globalConstraints, variableDomain) {
		var allTrue = false;
		for (var j = 0; j < globalConstraints.length; j++) {
			var globalConstraint = globalConstraints[j];

			if (!globalConstraint(variableDomain)) {
				return false;
			}
		}
		return true;
	}

	function create(cspData) {
		var variableDomain = cspData.variableDomain;
		var directedArcs = cspData.arcConstraints;
		var arcs = [];
		for (var i = 0; i < directedArcs.length; i++) {
			var bidirectionalArcs = getBidirectionalArcs(directedArcs[i]);
			arcs.push(bidirectionalArcs[0]);
			arcs.push(bidirectionalArcs[1]);
		}
		var globalConstraints = cspData.globalConstraints;
		var nodeConstraints = cspData.nodeConstraints;
		cspData.setVariableDomains = function(newVariableDomain) {
			variableDomain = newVariableDomain;
		}
		cspData.setVariableDomain = function(variable, domain) {
			variableDomain[variable] = domain;
		}
		cspData.getVariables = function() {
			return Object.keys(variableDomain);
		}
		cspData.isSolved = function() {
			for ( var variable in variableDomain) {
				if (variableDomain[variable].length != 1) {
					return false;
				}
			}

			return true;
		}
		cspData.assignmentSatisfiesGlobalConstraints = function(variable1, variable2, value1, value2) {
			var newVariableDomain = JSON.parse(JSON.stringify(variableDomain));
			newVariableDomain[variable1] = [ value1 ];
			newVariableDomain[variable2] = [ value2 ];
			return allGlobalConstraints(globalConstraints, newVariableDomain);
		}
		cspData.getArcs = function() {
			return arcs;
		}
		cspData.makeNodeConsistent = function() {
			for ( var variable in nodeConstraints) {
				var f = nodeConstraints[variable];
				var domain = variableDomain[variable];
				var valuesToDelete = [];
				for (var i = 0; i < domain.length; i++) {
					var value = domain[i];
					if (!f(value)) {
						valuesToDelete.push(value);
					}
				}
				for (var i = 0; i < valuesToDelete.length; i++) {
					domain.splice(domain.indexOf(valuesToDelete[i]), 1);
				}
			}
		}
		cspData.revise = function(arc) {
			console.log("revising arc consistency for variable: " + arc.getFirst());
			var constraintFunction = arc.getFunction();
			var firstDomain = variableDomain[arc.getFirst()];
			var secondDomain = variableDomain[arc.getSecond()];
			var valuesToDelete = [];
			for (var i = 0; i < firstDomain.length; i++) {
				var firstValue = firstDomain[i];
				// console.log("checking value: " + firstValue);
				var any = false;
				for (var j = 0; j < secondDomain.length; j++) {
					var secondValue = secondDomain[j];
					if (constraintFunction(firstValue, secondValue)
							&& cspData.assignmentSatisfiesGlobalConstraints(arc.getFirst(), arc.getSecond(),
									firstValue, secondValue)) {
						any = true;
						break;
					}
				}
				if (!any) {
					// console.log("no values in " + arc.getSecond() + " can
					// satisfy it. Remove it.");
					valuesToDelete.push(firstValue);
				}
			}
			for (var i = 0; i < valuesToDelete.length; i++) {
				firstDomain.splice(firstDomain.indexOf(valuesToDelete[i]), 1);
			}
			return valuesToDelete.length > 0;
		}
		cspData.clone = function() {
			var newVariableDomain = {};
			for ( var variable in variableDomain) {
				newVariableDomain[variable] = variableDomain[variable].slice();
			}
			var newData = {
				"variableDomain" : newVariableDomain,
				"arcConstraints" : directedArcs,
				"globalConstraints" : globalConstraints
			}

			return create(newData);
		}
		cspData.isConsistentAssignment = function(variable) {
			// TODO check if can refactor with revise
			if (!allGlobalConstraints(globalConstraints, variableDomain)) {
				return false;
			}
			var affectedArcs = cspData.getArcConstraintsToExcept(variable, null);
			for (var a = 0; a < affectedArcs.length; a++) {
				var arc = affectedArcs[a];
				var constraintFunction = arc.getFunction();
				var first = arc.getFirst();
				var second = arc.getSecond();
				var firstDomain = variableDomain[first];
				var secondDomain = variableDomain[second];
				var any = false;
				for (var i = 0; !any && i < firstDomain.length; i++) {
					var firstValue = firstDomain[i];
					for (var j = 0; !any && j < secondDomain.length; j++) {
						var secondValue = secondDomain[j];
						if (constraintFunction(firstValue, secondValue)) {
							any = true;
							break;
						}
					}
				}
				if (!any) {
					return false;
				}
			}
			return true;
		}
		cspData.getArcConstraintsToExcept = function(targetVariable, excludeVariable) {
			var ret = [];
			for (var i = 0; i < arcs.length; i++) {
				var arcConstraint = arcs[i];
				if (arcConstraint.getSecond() == targetVariable && arcConstraint.getFirst() != excludeVariable) {
					ret.push(arcConstraint);
				}
			}

			return ret;
		}
		cspData.getVariableDomains = function() {
			return variableDomain;
		}
		cspData.getVariableDomain = function(variable) {
			return variableDomain[variable];
		}
		cspData.noSolutionFound = function() {
			for ( var variable in variableDomain) {
				if (variableDomain[variable].length == 0) {
					return true;
				}
			}
			return false;
		}
		cspData.getUnsolvedVariables = function() {
			var ret = [];
			for ( var variable in variableDomain) {
				if (variableDomain[variable].length > 1) {
					ret.push(variable);
				}
			}

			return ret;
		}
		cspData.getSolvedVariableDomains = function() {
			var ret = {};
			for ( var variable in variableDomain) {
				if (variableDomain[variable].length == 1) {
					ret[variable] = variableDomain[variable];
				}
			}

			return ret;
		}

		return cspData;
	}

	return create;
});