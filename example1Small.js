define([ "maxPerCategoryConstraint" ], function(maxPerCategoryConstraint) {
	var domain = [ "r1", "r2" ];
	var sameRoom = function(a, b) {
		return a == b;
	};
	var maxPerRoom = maxPerCategoryConstraint({
		"r1" : 2,
		"r2" : 3
	});
	return {
		"variableDomain" : {
			"a" : domain.slice(),
			"b" : domain.slice(),
			"c" : domain.slice(),
			"d" : domain.slice()
		},
		"arcConstraints" : [ {
			"v1" : "a",
			"v2" : "b",
			"f" : sameRoom
		}, {
			"v1" : "a",
			"v2" : "c",
			"f" : sameRoom
		} ],
		"globalConstraints" : [ maxPerRoom ]
	}
});
