// Se of functions used to determine calculated activity levels
var rates = require('./rates.json');

function factorial (n) {
	var f = [];
	if (n == 0 || n == 1)
		return 1;
	if (f[n] > 0)
		return f[n];
	return f[n] = factorial(n-1) * n;
}

// Inputs
// rate : non negaive integer
// arr : array of recent activity levels per minute, most recent minute being first
// Output
// weighted activity level
// Example weightedAverage(diner,[last minute activity,2 minutes ago activity])
function weightedActivity(diner,arr) {
	
	var level = arr.length;
	var location =rates.data.filter(function (el)
		{
		return el.name == diner.centerName;
		});
	if (level == 0 | !location[0]) {
		return null;
	}
	// console.log(diner.centerName);
	
	var rate = location[0].rate;
	var activity = 0;
	arr.forEach(function(obj,i) {
		activity += (level-i)*Math.max(obj,0);
	})
	// console.log(rate,arr);
	console.log(diner.centerName,arr,activity/(rate*(Math.pow(level,2)+level)/2));
	return activity/(rate*(Math.pow(level,2)+level)/2);
}

module.exports = {
	weightedActivity : weightedActivity
};