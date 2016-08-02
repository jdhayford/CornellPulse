/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */

(function ($) {

    var defaults = {
        min: {
            x: 20,
            y: 20
        },
        left: $.noop,
        right: $.noop,
        up: $.noop,
        down: $.noop
    }, isTouch = "ontouchend" in document;
    
    $.event.props.push("touches");

    $.fn.swipe = function (options) {

        options = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            var startX;
            var startY;
            var isMoving = false;

            function cancelTouch() {
                elem.off('mousemove.swipe touchmove.swipe', onTouchMove);
                startX = null;
                isMoving = false;
            }

            function onTouchMove(e) {

                if (isMoving && e.touches) {
                    var x = isTouch ? e.touches[0].pageX : e.pageX;
                    var y = isTouch ? e.touches[0].pageY : e.pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if (Math.abs(dx) >= (options.min.x || options.min)) {
                        cancelTouch();
                        if (dx > 0) {
                            options.left();
                        } else {
                            options.right();
                        }
                    } else if (Math.abs(dy) >= (options.min.y || options.min)) {
                        cancelTouch();
                        if (dy > 0) {
                            options.up();
                        } else {
                            options.down();
                        }
                    }
                }
            }

            function onTouchStart(e) {
                if (e.touches) {
                    startX = isTouch ? e.touches[0].pageX : e.pageX;
                    startY = isTouch ? e.touches[0].pageY : e.pageY;
                    isMoving = true;
                    elem.on('mousemove.swipe touchmove.swipe', onTouchMove);
                }
            }

            // if ('ontouchend' in document) {
                elem.on('mousedown touchstart', onTouchStart);
            // }
        });

    };

})(jQuery);

function removeHoverCSSRule() {
  if ('createTouch' in document) {
    try {
      var ignore = /:hover/;
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        if (!sheet.cssRules) {
          continue;
        }
        for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
          var rule = sheet.cssRules[j];
          if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText)) {
            sheet.deleteRule(j);
          }
        }
      }
    }
    catch(e) {
    }
  }
}