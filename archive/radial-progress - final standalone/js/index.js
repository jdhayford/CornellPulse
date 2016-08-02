/* Set Progress | jQuery
======================================*/
//document.querySelector('.fill').getTotalLength();

$(document).ready(function(){
	var max = 150.72259521484375;
	var shade;
	// Create each radial progress bar and color it
	// dynamically based on its data-progress value
	$.each($('.progress'), function( index, value ){
		percent = Math.random();
		$(value).data('progress',percent);
		shade = getColor(percent);
		$(value).children($('.fill')).attr({"fill":shade,"stroke":shade,"style": "stroke-dashoffset: "+(1-percent) * max});
	});
	
});

// Returns a color from green to red depending
// on the value [0,1] that it gets
function getColor(value){
    //value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}