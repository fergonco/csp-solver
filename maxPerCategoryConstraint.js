define(function() {

	function checkGlobalSizes(variableDomain, categorySizes) {
		var totalSize = 0;
		for ( var category in categorySizes) {
			totalSize += categorySizes[category];
		}

		return Object.keys(variableDomain).length <= totalSize;
	}

	function create(categorySizes) {
		return function(variableDomain) {
			if (!checkGlobalSizes(variableDomain, categorySizes)) {
				return false;
			}
			// console.log("checking room sizes");
			var acums = {};
			for ( var variable in variableDomain) {
				var domain = variableDomain[variable];
				if (domain.length == 1) {
					var room = domain[0];

					if (!(room in acums)) {
						acums[room] = 0;
					}
					acums[room]++;
					if (acums[room] > categorySizes[room]) {
						// console.log("cannot fit");
						// console.log(acums);
						return false;
					}
				}
			}
			// console.log("may fit");
			// console.log(acums);
			return true;
		}
	}

	return create;
})