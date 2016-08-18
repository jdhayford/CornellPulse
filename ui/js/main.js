// This will be the main javascript file that pulls from the rest API and creates the elements

// First we will have an AJAX call that hits the Rest API and populates the whole page
$( document ).ready( function() {
	

	$.ajax({ 
	   type: "GET",
	   dataType: "json",
	   url: "http://cornellpulse.com:3000/test",
	   success: function(data){    
	   	// Loop through diners from Rest API
	   	var container = $('.din-wrapper');
	     data.diners.forEach( function(value,index) {
	     	buildEatery(value,container);
	     });
	     dinViz();

	     // Loop over all gyms from Rest API
	     var container = $('.fit-wrapper');
	     data.gyms.forEach( function(value,index) {
	     	buildGym(value,container);
	     });
	     fitViz();

	     expandDiner();
	     expandGym();
	   }
	});

});




var campusRef = {"104West!":"West","Amit Bhatia Libe Café":"Central","Atrium Café":"Central","Bear Necessities Grill & C-Store":"North","Bear's Den":"Central","Becker House Dining Room":"West","Big Red Barn":"Central","Bus Stop Bagels":"Central","Café Jennie":"Central","Carol's Café":"North","Cook House Dining Room":"West","Cornell Dairy Bar":"Central","Goldie's Café":"Central","Green Dragon":"Central","Hot Dog Cart":"Central","Ivy Room":"Central","Jansen's Dining Room at Bethe House":"West","Jansen's Market":"West","Keeton House Dining Room":"West","Mac's Café":"Central","Martha's Café":"Central","Mattin's Café":"Central","North Star Dining Room":"North","Okenshields":"Central","Risley Dining Room":"North","Robert Purcell Marketplace Eatery":"North","Rose House Dining Room":"West","Rusty's":"Central","Sweet Sensations":"North","Synapsis Café":"Central","Terrace":"Central","Trillium":"Central"};

// Function to build the html for an eatery from REST API
// where input is an object instance from JSON
function buildEatery(obj,target) {
	// TOFO: Add campus location.. somewhere
	var row = document.createElement('div');
	var order = (obj.status == 'Open'?'open':'closed');
	$(row).attr({'id':obj.location,'class':'din-row '+order,'location':campusRef[obj.location]}).appendTo(target);
	$("<div>").addClass("din-logo")
	    .append($('<img class="logo">').attr('src',obj.image.replace("https", "http")))
	    .appendTo(row);
    var $left = jQuery('<div/>', { 'class': "din-left" }).appendTo(row);
    $("<div>").addClass("din-title")
	    .html(obj.location.replace("Dining Room",""))
	    .appendTo($left);
    $("<div>").addClass("din-status")
	    .html(obj.status)
	    .appendTo($left);
	console.log(obj.location,obj.surgeCount,obj.surgePeak);
    var $ind = jQuery('<div/>', { 'class': "flex-indicators" }).appendTo(row);
	if (obj.status == 'Open'){
		var $prog = $("<svg viewBox='0 0 80 80'>").addClass("progress")
			.data("percent",obj.surgeCount/obj.surgePeak)
			.html('<g class="icon icon-queue"><text x="25%" y="80%">&#xe804;</text></g><path class="track" transform="translate(-10 8) rotate(45 50 50)" d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32"></path><path class="fill" transform="translate(-10 8) rotate(45 50 50)" d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32"></path>')
			.appendTo($ind);
	}
}


// Function to build the html for a gym from REST API
// where input is an object instance from JSON
function buildGym(obj,target) {
	var row = document.createElement('div');
	var order = (obj.status == 'Open'?'open':'closed');
	$(row).addClass('flex-row '+order).appendTo(target);
    var $top = jQuery('<div/>', { 'class': "flex-top" }).appendTo(row);
    $("<div>").addClass("flex-title")
	    .html(obj.location)
	    .appendTo($top);
    $("<div>").addClass("flex-status")
	    .html(obj.status)
	    .appendTo($top);

    var $bot = jQuery('<div/>', { 'class': "flex-bot" }).appendTo(row);
    
    $("<div>").addClass("flex-bar")
    	.data('percent',obj.count/obj.peak)
	    .appendTo($bot);
}
