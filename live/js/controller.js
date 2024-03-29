// Main responsive functons executed

function filterEateries(dir) {
  $('.locBlock').removeClass('active');
  $('.locBlock[id="'+activeLocation+'"]')
    .addClass('active');
  var filter = $('.locBlock.active').attr('filter');

     $('#din-wrapper').velocity({
      opacity:0
     },{duration:25,
        complete: function(els) {
            setTimeout(function(){
              // console.log($('.din-row'));

              $('.din-row').each(function (i,value) {
                  if ($(this).attr('location')){
                    if ( $(this).attr('location').includes(filter) ) { $(this).removeClass('hide');
                    } else { 
                      $(this).addClass('hide');
                    }
                  }
                });

              },50);
              // $(els).attr('style','');
              $(els).velocity("transition.slide"+dir+"In", {display:'flex',delay:50, duration:150,easing:'linear'});
              
            }
      });
     
}

// Based on the state, toggle between Fitness and Dining
function updateState(state) {
  $('.navBlock').removeClass('active');
  $("#"+state+"").addClass('active');
  if (state == 'din') {
        $('#alert').toggle();
        $('#loc').removeClass('hide');
        $('#fit-wrapper').addClass('hide');
        $('#din-wrapper').removeClass('hide');
        $('#din-wrapper').velocity('transition.slideLeftIn',{display:'flex',duration:150});
      } else { 
        $('#loc').addClass('hide');
        $('#fit-wrapper').removeClass('hide');
        $('#din-wrapper').addClass('hide');
        $('#alert')
        .html('Fitness center data coming soon.')
        .toggle();
      }
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

  //Takes input of a fraction
  // Performance mathematical operation to get the best wieghted
  // score of traffic level.
  function score(fraction) {
    var offset = 0.225;
    var multiplier = 7;
    var score = (Math.tanh((fraction/2-offset)*multiplier) +1)/2;
    return Math.min(Math.max(0,score),1);
  }

  // Function enter expanded view upon selectin a row
  function expandDiner() {
    // $('.din-row').click(function() {
    //   if ($(this).hasClass('active')) {
    //     $(this).removeClass('active');
    //     $(this).find('div.din-status').toggle();
    //     $(this).find('div.din-extra').remove();
    //     $(this).find('div.extra-status').remove();
        
    //   } else {
    //     $(this).addClass('active');
    //     // $(this).find('div.din-status').toggle();
    //     $('<div class="din-extra">').appendTo($(this));
    //     $('<div class="extra-status">').html('Here :Here').appendTo($(this).find('div.din-extra'));
    //     $('<div class="din-extra">').appendTo($(this));
    //   }
    // })
  }

    // Function enter expanded view upon selectin a row
  function expandGym() {
    // $('.flex-row').click(function() {
    //   if ($(this).hasClass('expand')) {
    //     $(this).removeClass('expand');
    //   } else {
    //     $(this).addClass('expand');
    //   }
    // })
  }