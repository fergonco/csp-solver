define(function() {

	function solveArcs(csp, queue) {
		while (queue.length > 0) {
			var arc = queue.splice(0, 1)[0];
			// console.log("processing arc: " + arc.getFirst() + "->" +
			// arc.getSecond());
			if (csp.revise(arc)) {
				if (csp.getVariableDomain(arc.getFirst()).length == 0) {
					return false;
				}
				var arcs = csp.getArcConstraintsToExcept(arc.getFirst(), arc.getSecond());
				for (var i = 0; i < arcs.length; i++) {
					queue.push(arcs[i]);
				}
			}
		}

		return true;
	}

	return {
		"solveArcs" : solveArcs,
		"solve" : function(csp) {
			var queue = csp.getArcs();
			return solveArcs(csp, csp.getArcs());
		}
	}
});
