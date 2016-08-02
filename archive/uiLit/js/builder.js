// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

var state = 'din';

var height = $('#header').css('height');

// On picking a nav block, use the info to toggle the Navigation state
// between fitness and dining
$('.navBlock').on('click', function(){
      state = $(this).attr('id');
      updateState(state);
  });

var activeLocation = 0;
  // On picking a location block, use the location block info to filter eateries
  $('.locBlock').on('click', function(){
      activeLocation = $(this).attr('id')*1;
      filterEateries();
  });

// Hide header Logo when scrolling down
$('.din-wrapper').on({'mousewheel': function(event) {
    if( ($(window).scrollTop()==0 && $('#header').css('height') == height) && (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0 )) { //alternative options for wheelData: wheelDeltaX & wheelDeltaY
      //scroll down
      $('#header').velocity({
          height:'0',
          margin: '0',
          opacity:'0',
          overflow:'hidden',
          transform:'translateY(100px)'
        },{duration:150,easing:"linear"});
      return false;
      }
    }    
})

// Show header Logo when reaching the top
$('.din-wrapper').on('scroll', function(e) {
  if ($('.din-wrapper').scrollTop() == 0) {
    $('#header').velocity({
          height:height,
          'margin-top': '5px',
          opacity:'1',
          overflow:'visible',
          transform:'none'
        },{duration:150,easing:"linear"});
  }
})




// Event handler for swiping
$(document).swipe({
    left: function () {
      console.log('left');
      // If on a dining location, transition to the next location
      if (activeLocation == 3) {
        return;
      } else if (state == 'din') {
        activeLocation = Math.min(3,activeLocation+1);
        filterEateries();
      }
    },
    right: function () {
      // If on a dining location, transition to prior location
      if (state == 'din') {
        if (activeLocation == 0) {
          return;
        } else {
          activeLocation = Math.max(0,activeLocation-1);
          filterEateries();
        }
      }
    },
    up: function () {
      // Hide header logo when scrolling downward from top
        if( $(window).scrollTop()==0 && $('#header').css('height') == height) {
          $('#header').velocity({
            height:'0',
            opacity:'0',
            margin:'0',
            overflow:'hidden'
        },{duration:150,easing:"linear"});
        }
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
    $.each($('.din-row'), function (index, value) {
      if ($(value).attr('location').includes(filter)) {
       $(value).removeClass('hide');
        $(value).addClass('show');
      }});
}

// Based on the state, toggle between Fitness and Dining
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

function diningLeft() {
  $('.din-wrapper').velocity('transition.slideLeftOut',{duration:100,stagger:300});
  $('.din-wrapper').velocity('transition.slideRightIn',{duration:100,delay:200,stagger:300});
}

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
        $(value).css('color','#1DB815');
      } else if ($(value).text() == "Closed") {
        $(value).css('color','#E11A1F');
      } else {
        $(value).css('color','rgb(245, 202, 102)');
      }
    })
}

  // Returns a color from green to red depending
  // on the value [0,1] that it gets
  function getColor(value){
      var beg = {"h":117.4,"s":95,"l":45}; // #98ff82
      var end = {"h": 0,"s":90,"l":60}; // #ed6a5a
      //value from 0 to 1
      var mix = [
          Math.round(tween(beg.h,end.h,value)),
          Math.round(tween(beg.s,end.s,value))+"%",
          Math.round(tween(beg.l,end.l,value))+"%"
          ];

      return "hsl("+mix.join(',')+")";
      
  }

function tween(a,b,val) {
  return a + (a<b?Math.abs(a-b)*val:-Math.abs(a-b)*val)
}
