// This will be the main javascript file that pulls from the rest API and creates the elements

// First we will have an AJAX call that hits the Rest API and populates the whole page
$( document ).ready( function() {
	update();
});

function update() {
	$.ajax({ 
	   type: "GET",
	   dataType: "json",
	   url: "http://cornellpulse.com:3000/api",
	   // url: "http://localhost:3000/api",
  		// error: function () {
  		// 	$('.loading').toggle();
  		// 	$('#alert').hide()
  		// 	.html('Failed to retrieve data, please try againn.');
  		// },
	   success: function(data){ 
	   	// Loop through diners from Rest API
	   	var container = $('#din-wrapper');
	     data.diners.forEach( function(value,index) {
	     	buildEatery(value,container);
	     });
	     // dinViz();

	     // Loop over all gyms from Rest API
	     var container = $('#fit-wrapper');
	     data.gyms.forEach( function(value,index) {
	     	buildGym(value,container);
	     });
	     radViz();

	     expandDiner();
	     $('.loading').toggle();
	     $('#alert').hide();
	     expandGym();

	     if (data.diners.length == 0 && data.gyms.length== 0) {$('#alert').toggle()
  			.html('Failed to retrieve data, please try again.');}
	   }
	});
	}


var campusRef = {"104West!":"West","Amit Bhatia Libe Café":"Central","Atrium Café":"Central","Bear Necessities Grill & C-Store":"North","Bear's Den":"Central","Becker House Dining Room":"West","Big Red Barn":"Central","Bus Sleft Bagels":"Central","Café Jennie":"Central","Carol's Café":"North","Cook House Dining Room":"West","Cornell Dairy Bar":"Central","Goldie's Café":"Central","Green Dragon":"Central","Hot Dog Cart":"Central","Ivy Room":"Central","Jansen's Dining Room at Bethe House":"West","Jansen's Market":"West","Keeton House Dining Room":"West","Mac's Café":"Central","Martha's Café":"Central","Mattin's Café":"Central","North Star Dining Room":"North","Okenshields":"Central","Risley Dining Room":"North","Robert Purcell Marketplace Eatery":"North","Rose House Dining Room":"West","Rusty's":"Central","Sweet Sensations":"North","Synapsis Café":"Central","Terrace":"Central","Trillium":"Central"};

// Function to build the html for an eatery from REST API
// where input is an object instance from JSON
function buildEatery(obj,target) {
	// TOFO: Add campus location.. somewhere
	var row = document.createElement('div');
	var order = (obj.status == 'Closed'?'closed':'open');
	$(row).attr({'id':obj.location,'class':'din-row '+order,'location':campusRef[obj.location]}).appendTo(target);
	var cont = $("<div>").addClass('din-base').appendTo(row);
	if (obj.about) {
		$("<div>").addClass("din-logo")
		    .append($('<img class="logo">').attr('src',obj.about.replace("https", "http")))
		    .appendTo(cont);
	} else {
		// JANKY FIX, TODO: Find a cleaner way of incorporating these png files
		if (obj.location.includes('Mac')) {
			$("<div>").addClass("din-logo")
		    .append($('<img class="logo">').attr('src','./css/Macs.png'))
		    .appendTo(cont);
		} else {
			$("<div>").addClass("din-logo")
		    .append($('<img class="logo">').attr('src','./css/Terrace.png'))
		    .appendTo(cont);
		}
		
	}
    var $left = jQuery('<div/>', { 'class': "din-left" }).appendTo(cont);
    $("<div>").addClass("din-title")
	    .html(obj.location.replace("Dining Room","").replace('Grill & C-Store',''))
	    .appendTo($left);
    $("<div>").addClass("din-status")
	    .html(obj.status +(obj.next? ' ' + obj.next:''))
	    .appendTo($left);
    console.log(obj.location,obj.experimentalSurge);
    var $ind = jQuery('<div/>', { 'class': "flex-indicators" }).appendTo(cont);
	if (obj.status != 'Closed'){
		var $prog = $("<svg viewBox='0 0 80 80'>").addClass("progress")
			.data("percent",score(obj.experimentalSurge))
			.html('<g class="icon icon-queue"><text x="25%" y="80%">&#xe804;</text></g><path class="track" transform="translate(-10 8) rotate(45 50 50)" d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32"></path><path class="fill" transform="translate(-10 8) rotate(45 50 50)" d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32"></path>')
			.appendTo($ind);
	}
}


// Function to build the html for a gym from REST API
// where input is an object instance from JSON
function buildGym(obj,target) {
	var row = document.createElement('div');
	var status = (obj.count?obj.status:'Closed');
	var order = (status == 'Closed'?'closed':'open');
	$(row).addClass('flex-row '+order).appendTo(target);
    var $left = jQuery('<div/>', { 'class': "flex-left" }).appendTo(row);
    $("<div>").addClass("flex-title")
	    .html(obj.location)
	    .appendTo($left);

    $("<div>").addClass("flex-status")
	    .html(status)
	    .appendTo($left);
    var $ind = jQuery('<div/>', { 'class': "flex-indicators" }).appendTo(row);
	if (status != 'Closed'){
		var $prog = $("<svg viewBox='0 0 80 80'>").addClass("progress")
			.data("percent",score(obj.count/obj.peak))
			.html('<g class="icon icon-queue"><text x="25%" y="80%">&#xe804;</text></g><path class="track" transform="translate(-10 8) rotate(45 50 50)" d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32"></path><path class="fill" transform="translate(-10 8) rotate(45 50 50)" d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32"></path>')
			.appendTo($ind);
	}

}
