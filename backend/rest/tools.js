// This javascript file contains the varous "tooling" functions used

// Specialized function for looping through raw
// rest API response, array, and combining the count with our
// existing json, where target is the string for the 
// corresponding unit location.
function parseCount(target,array,type){
	for (var i=0 ; i < array.length ; i++)
	{
	    // Look for corresponding location name, but
	    // avoid '*** Issue' locations
	    if (array[i][type].indexOf(target) > -1 &
	    		array[i][type].indexOf('Issue') == -1) {
	        return array[i].CustomerCount;
	    }
	}
}

/*
	NAMES_MAP is a one-to-one mapping between Dining Hall names from now.dining.cornell api 
(https://now.dining.cornell.edu/api/1.0/dining/eateries.json) and from CornellPulse's own API
	NOTE: 
	We are missing Bear's Den, Stocking Hall Dairy Bar, Mattins
 */
var NAMES_MAP = {
	"Kosher": "104West!",
	"Olin Libe Cafe": "Amit Bhatia Libe Café",
	"Sage" : "Atrium Café",
	"Bear Necessities" :"Bear Necessities Grill & C-Store",
	"Carl Becker House" : "Becker House Dining Room",
	"Big Red Barn" : "Big Red Barn",
	"Bus Stop Bagels" : "Bus Stop Bagels",
	"Cafe Jennie" : "Café Jennie",
	"Carols Cafe" : "Carol's Café",
	"Alice Cook House" : "Cook House Dining Room",
	"Goldie's" : "Goldie's Café",
	"Green Dragon" : "Green Dragon",
	"Ivy Room" : "Ivy Room",
	"Jansens at Bethe House" : "Jansen's Dining Room at Bethe House",
	"Jansen's Market" : "Jansen's Market",
	"Keeton House" : "Keeton House Dining Room",
	"Marthas" : "Martha's Café",
	"Duffield": "Mattin's Café",
	"North Star Marketplace" : "North Star Dining Room",
	"Okenshields" : "Okenshields",
	"Risley" : "Risley Dining Room",
	"RPME" : "Robert Purcell Marketplace Eatery", 
	"Rose House" : "Rose House Dining Room",
	"Rustys" : "Rusty's",
	"Sweet Sensation" : "Sweet Sensations",
	"Synapsis Cafe" : "Synapsis Café", 
	"Trillium" : "Trillium",
	"Statler Terrace":"Terrace",
	"Statler Macs" : "Mac's Café"
}

/* Given a name (from either our API or from now.dining.cornell), returns opposite name*/
function getOppositeName(name) {
	if (! NAMES_MAP[name]) {

		for(var key in NAMES_MAP) {
			var value = NAMES_MAP[key];
			if (name === value) {
				return key;
			}
		}
	} else {
		return NAMES_MAP[name];
}}

// This function simply returns the reverse of string s
function reverse(s) {
  var o = '';
  for (var i = s.length - 1; i >= 0; i--)
    o += s[i];
  return o;
}


// This mess of a function takes the current time in hours and minutes,
// then pulls the opening and closing times from gym out of the gymHours.json
// and returns whether "gym" is open or closed
// TODO: Find a prettier way to do this
function gymTime(gym,times) {
	var status = "Closed";
	var currentDate = new Date( new Date().getTime() + -4 * 3600 * 1000);	
    var open = (currentDate.getHours() > times[currentDate.getDay()][gym].split(':')[0] | 
    			(currentDate.getHours() == times[currentDate.getDay()][gym].split(':')[0] & currentDate.getMinutes() > times[currentDate.getDay()][gym].split(':')[1])) &&
    			(currentDate.getHours() < times[currentDate.getDay()][reverse(gym)].split(':')[0] |
    				(currentDate.getHours() == times[currentDate.getDay()][reverse(gym)].split(':')[0] & currentDate.getMinutes() < times[currentDate.getDay()][reverse(gym)].split(':')[1]));
	return (open ? "Open" : "Closed");

}

module.exports = {
	parseCount : parseCount,

	getOppositeName: getOppositeName,

	gymTime: gymTime,

	reverse : reverse
}