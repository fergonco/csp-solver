define(function() {

	var variableDomain = {};
	var arcs = [];
	var globalConstraints = [];

	var csp = {
		"addVariable" : function(variable, domain) {
			variableDomain[variable] = domain;
		},
		"addGlobalConstraint" : function(constraint) {
			globalConstraints.push(constraint);
		},
		"allGlobalConstraints" : function(variable1, variable2, value1, value2) {
			console.log("checking global constraints with the following hypothetical variable domains");
			var newVariableDomain = JSON.parse(JSON.stringify(variableDomain));
			newVariableDomain[variable1] = [ value1 ];
			newVariableDomain[variable2] = [ value2 ];
			console.log(newVariableDomain);
			var allTrue = false;
			for (var j = 0; j < globalConstraints.length; j++) {
				var globalConstraint = globalConstraints[j];

				if (!globalConstraint(newVariableDomain)) {
					console.log("global constraint not satisfied");
					return false;
				}
			}
			return true;
		},
		"addArcConstraint" : function(variable1, variable2, constraint) {
			arcs.push({
				"getFirst" : function() {
					return variable1
				},
				"getSecond" : function() {
					return variable2
				},
				"getFunction" : function() {
					return constraint
				}
			});
			arcs.push({
				"getFirst" : function() {
					return variable2
				},
				"getSecond" : function() {
					return variable1
				},
				"getFunction" : function() {
					return function(a, b) {
						return constraint(b, a);
					}
				}
			});
		},
		"getArcs" : function() {
			return arcs;
		},
		"revise" : function(arc) {
			console.log("revising arc consistency for variable: " + arc.getFirst());
			var constraintFunction = arc.getFunction();
			var firstDomain = variableDomain[arc.getFirst()];
			var secondDomain = variableDomain[arc.getSecond()];
			var indicesToDelete = [];
			for (var i = 0; i < firstDomain.length; i++) {
				var firstValue = firstDomain[i];
				console.log("checking value: " + firstValue);
				var any = false;
				for (var j = 0; j < secondDomain.length; j++) {
					var secondValue = secondDomain[j];
					if (constraintFunction(firstValue, secondValue)
							&& csp.allGlobalConstraints(arc.getFirst(), arc.getSecond(), firstValue, secondValue)) {
						any = true;
						break;
					}
				}
				if (!any) {
					console.log("no values in " + arc.getSecond() + " can satisfy it. Remove it.");
					indicesToDelete.push(i);
				}
			}
			for (var i = 0; i < indicesToDelete.length; i++) {
				firstDomain.splice(indicesToDelete[i], 1);
			}
			return indicesToDelete.length > 0;
		},
		"getArcConstraintsFromExcept" : function(sourceVariable, excludeVariable) {
			var ret = [];
			for (var i = 0; i < arcs.length; i++) {
				var arcConstraint = arcs[i];
				if (arcConstraint.getFirst() == sourceVariable && arcConstraint.getSecond() != excludeVariable) {
					ret.push(arcConstraint);
				}
			}

			return ret;
		},
		"getVariableDomains" : function() {
			return variableDomain;
		},
		"getVariableDomain" : function(variable) {
			return variableDomain[variable];
		}
	}

	return csp;
});