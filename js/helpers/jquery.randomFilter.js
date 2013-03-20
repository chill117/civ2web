$.jQueryRandom = 0;
$.extend($.expr[":"], {
	random: function(a, i, m, r) {

		if (i == 0) {
			$.jQueryRandom = Math.floor(Math.random() * r.length);
		}

		return i == $.jQueryRandom;
	}
});