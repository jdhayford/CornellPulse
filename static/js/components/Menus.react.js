/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');

var Menu= React.createClass({
  processFood: function(menu) {
    if (menu.length == 0) {
      return (
        <p>
          Sorry, menu information is unavailable.
        </p>
      )
    } 
    var foodItems = menu.map(function(category) {
      return category.items.map(function(item) {
        return (
          <p>
            {item.item}
          </p>
        );
      })
    });

    var flattenedFoodItems = [].concat.apply([], foodItems);
    return flattenedFoodItems;
  },

  render: function() {
    var _this = this;
    var event = this.props.data;
    return (
      <div className="menu">
        <p className="menu-period">
          {event.descr == "" ? "N/A" : event.descr} | {event.start} - {event.end}
        </p>
        <p className="food-items">
          {(this.processFood(event.menu))}
        </p>
      </div>
    );
  }
});

module.exports = Menu;
