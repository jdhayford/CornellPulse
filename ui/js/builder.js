// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
// Retrieve all elements of class "bar"
var bars = Array.prototype.slice.call(document.getElementsByClassName("flex-bar"));
console.log(bars);

// For each of the "bar" elements, generate a progress bar
bars.forEach(function(b) {
  console.log(b);
  var bar = new ProgressBar.Line(b, {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#FFEA82',
    // trailColor: '#525658',
    // trailWidth: 1,
    svgStyle: {width: '100%', height: '100%'},
    from: {color: '#d6ff82'},// Previous #FFEA82
    to: {color: '#ED6A5A'},
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
    }
  });
	
  bar.animate(Math.random());  // Random number from 0.0 to 1.0
});

$('.navBlock').on('click', function(){

    $('.navBlock').removeClass('active');
    $(this).addClass('active');
    if ($('#dining').hasClass('active')) {
      $('#loc').removeClass('hide');
    } else { 
      $('#loc').addClass('hide');
    }
});

$('.locBlock').on('click', function(){

    $('.locBlock').removeClass('active');
    $(this).addClass('active');
});