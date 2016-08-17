// Set up data visuals for fitness rows
function fitViz() {

  var bars = Array.prototype.slice.call(document.getElementsByClassName("flex-bar"));

  // For each of the "bar" elements, generate a progress bar
  bars.forEach(function(b) {
    var bar = new ProgressBar.Line(b, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      // trailColor: '#525658',
      // trailWidth: 1,
      svgStyle: {width: '100%', height: '100%'},
      from: {color: '#98ff82'},// Previous #FFEA82 98ff82
      to: {color: '#ED6A5A'},
      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
      }
    });
  	
    var percent = $(b).data().percent || 0;
    bar.animate(percent);  // Random number from 0.0 to 1.0
  });
}
  
// Set up data visuals for dining rows
function dinViz() {
    var max = 150.72259521484375;
    var shade;
    // Create each radial progress bar and color it
    // dynamically based on its data-progress value
    $.each($('.progress'), function( index, value ){
      var percent = $(value).data().percent;
      shade = getColor(percent);
      $(value).children('.fill').css("stroke",shade);
      $(value).children('.fill').css("stroke-dashoffset",(1-percent) * max);
      $(value).children('.icon').css("fill",shade);
    });
    
    $.each($('.flex-status'), function (index, value) {
      if ($(value).text() == "Open") {
        $(value).css('color','#98ff82');
      } else if ($(value).text() == "Closed") {
        $(value).css('color','#ED6A5A');
      } else {
        $(value).css('color','rgb(245, 202, 102)');
      }
    })

    $.each($('.din-status'), function (index, value) {
      if ($(value).text() == "Open") {
        $(value).css('color','#98ff82');
      } else if ($(value).text() == "Closed") {
        $(value).css('color','#ED6A5A');
      } else {
        $(value).css('color','rgb(245, 202, 102)');
      }
    })
}