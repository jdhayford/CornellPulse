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


// $('#din-wrapper').on('wheel',function(e) {
//   var delta = e.originalEvent.deltaY;
//   if (delta < 0 && $(this).scrollTop() == 0 && $('#header').attr('display') == 'none') { 
//     console.log('Come back');
//     $('#header').velocity('reverse');
//   } else if (delta >= 0 && $(this).scrollTop() > 1 && $('#header').attr('display') != 'none'){
//     $('#header').velocity("slideUp",{duration:200});
//   }    
// });


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
      } else if (state == 'fit') {
        state = 'din';
        updateState(state);
      }
    },
    up: function () {
      // Hide header logo when scrolling downward from top
        // if( $(window).scrollTop()<10 && $('#header').css('height') == height) {
        //   $('#header').velocity({
        //     height:'0',
        //     opacity:'0',
        //     margin:'0',
        //     overflow:'hidden'
        // },{duration:150,easing:"linear"});
        // }
    },
    down: function () {

    }
});



