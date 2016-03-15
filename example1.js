define([ "maxPerCategoryConstraint" ], function(maxPerCategoryConstraint) {
	var domain = [ "r1", "r2" ];
	var sameRoom = function(a, b) {
		return a == b;
	};
	var maxPerRoom = maxPerCategoryConstraint({
		"r1" : 4,
		"r2" : 5
	});
	return {
		"variableDomain" : {
			"a" : domain.slice(),
			"b" : domain.slice(),
			"c" : domain.slice(),
			"d" : domain.slice(),
			"e" : domain.slice(),
			"f" : domain.slice(),
			"g" : domain.slice(),
			"h" : domain.slice()
		},
		"arcConstraints" : [ {
			"v1" : "a",
			"v2" : "b",
			"f" : sameRoom
		}, {
			"v1" : "a",
			"v2" : "c",
			"f" : sameRoom
		}, {
			"v1" : "a",
			"v2" : "d",
			"f" : sameRoom
		}, {
			"v1" : "a",
			"v2" : "e",
			"f" : sameRoom
		} ],
		"globalConstraints" : [ maxPerRoom ]
	}
});
