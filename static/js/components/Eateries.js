/** @jsx React.DOM */

var React = require('react');
var Menu = require('./Menus.react');
var $ = require('jquery');

var Eatery = React.createClass({
  nameToID: function(name) {
    return name
      .replace(/\s+/g, '')
      .replace('!', '')
      .replace("\'", '')
      .replace("&", '')
      .concat("-wrapper");
  },

  onClick: function(hall_name) {
    console.log("clicking");
    var divID = "#" + this.nameToID(hall_name);
    $(divID).slideToggle(200);
  },

  render: function() {
    var _this = this;
    var hall_name = this.props.data.name;
    var hall_name_class = "hall-name " + this.props.data.status;
    var hall_name_id = this.nameToID(hall_name);
    var peak = this.props.data.peak;
    var currentDate = (new Date()).toISOString().slice(0, 10);    

    var menus = this.props.data.operatingHours.map(function(day) {
      if (day.date == currentDate) {
        if (day.events.length == 0) {
          return (
            <p>
              This location is not open today.
            </p>
          )
        }
        return day.events.map(function(event) {
          return (
            <Menu data={event}/>
          )
        });
      } 
    });

    return (
      <div className="eatery-wrapper">
        <div className={hall_name_class} onClick={_this.onClick.bind(_this, hall_name)}>
          {hall_name} (peak: {peak})
        </div>
        <div className="menu-wrapper" id={hall_name_id}>
          {menus}
        </div>
      </div>
    );
  }
});

module.exports = Eatery;
