// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

var state = 'din';

$('.navBlock').on('click', function(){
      state = $(this).attr('id');
      updateState(state);
  });

var activeLocation = 0;
  $('.locBlock').on('click', function(){
      activeLocation = $(this).attr('id')*1;
      filterEateries();
  });



// Event handler for swiping
$(document).swipe({
    left: function () {
      console.log('left');
      if (activeLocation == 3) {
        return;
      } else if (state == 'din') {
        activeLocation = Math.min(3,activeLocation+1);
        filterEateries();
      }
    },
    right: function () {
      if (state == 'din') {
        if (activeLocation == 0) {
          return;
        } else {
          activeLocation = Math.max(0,activeLocation-1);
          filterEateries();
      }
      } else {
        state = 'din';
        updateState(state);
      }
    },
    up: function () {
        console.log("up");
    },
    down: function () {
        console.log("down");
    }
});

function filterEateries() {
  $('.locBlock').removeClass('active');
  $('.locBlock[id="'+activeLocation+'"')
    .addClass('active');
  var filter = $('.locBlock.active').attr('filter');
    $('.din-row').removeClass('show');
    $('.din-row').addClass('hide');

    setTimeout(function(){
      $.each($('.din-row'), function (index, value) {
        if ($(value).attr('location').includes(filter)) {
         $(value).removeClass('hide');
          $(value).addClass('show');
           
        } else {
        }
      })
    },10)
  
}

function updateState(state) {
  $('.navBlock').removeClass('active');
  $("#"+state+"").addClass('active');
  if (state == 'din') {
        $('#loc').removeClass('hide');
        $('.fit-wrapper').addClass('hide');
        $('.din-wrapper').removeClass('hide');
      } else { 
        $('#loc').addClass('hide');
        $('.fit-wrapper').removeClass('hide');
        $('.din-wrapper').addClass('hide');
      }
}

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
    
    // $.each($('.flex-status'), function (index, value) {
    //   if ($(value).text() == "Open") {
    //     $(value).css('color','#98ff82');
    //   } else if ($(value).text() == "Closed") {
    //     $(value).css('color','#ED6A5A');
    //   } else {
    //     $(value).css('color','rgb(245, 202, 102)');
    //   }
    // })

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

  // Returns a color from green to red depending
  // on the value [0,1] that it gets
  function getColor(value){
      var beg = {"h":109.4,"s":100,"l":75.5}; // #98ff82
      var end = {"h": 6.5,"s":80.3,"l":64.1}; // #ed6a5a
      //value from 0 to 1
      var mix = [
          Math.round(beg.h-(beg.h-end.h)*value),
          Math.round(beg.s-(beg.s-end.s)*value)+"%",
          Math.round(beg.l-(beg.l-end.l)*value)+"%"
          ];

      return "hsl("+mix.join(',')+")";
      
  }


