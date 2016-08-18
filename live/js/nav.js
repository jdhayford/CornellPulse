// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
// Setup initial data
var state = 'din';
var height = $('#header').css('height');
var activeLocation = 0;

// On picking a nav block, use the info to toggle the Navigation state
// between fitness and dining
$('.navBlock').on('click', function(){

      state = $(this).attr('id');
      updateState(state);
  });


  // On picking a location block, use the location block info to filter eateries
  $('.locBlock').on('click', function(){
      var old = activeLocation;
      activeLocation = $(this).attr('id')*1;
      if (old < activeLocation) {
        filterEateries('Right');
      } else if (old > activeLocation) {
        filterEateries('Left');
      }
  });

// Hide header Logo when scrolling down
$('#din-wrapper').on({'mousewheel': function(event) {
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
$('#din-wrapper').on('scroll', function(e) {
  if ($('#din-wrapper').scrollTop() == 0) {
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
      // If on a dining location, transition to the next location
      if (activeLocation == 3) {
        return;
      } else if (state == 'din') {
        activeLocation = Math.min(3,activeLocation+1);
        filterEateries('Right');
      }
    },
    right: function () {
      // If on a dining location, transition to prior location
      if (state == 'din') {
        if (activeLocation == 0) {
          return;
        } else {
          activeLocation = Math.max(0,activeLocation-1);
          filterEateries('Left');
        }
      }
    },
    up: function () {
      // Hide header logo when scrolling downward from top
        if( $(window).scrollTop()<10 && $('#header').css('height') == height) {
          $('#header').velocity({
            height:'0',
            opacity:'0',
            margin:'0',
            overflow:'hidden'
        },{duration:150,easing:"linear"});
        }
    },
    down: function () {

    }
});



