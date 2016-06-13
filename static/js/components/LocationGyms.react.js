   /** @jsx React.DOM */

var React = require('react');
var Gym = require('./Gyms.react');
var $ = require('jquery');

var LocationGyms = React.createClass ({
  render: function() {
    var _this = this;
    var gyms = this.props.gymdata.map(function(gym) {
      return (
        <Gym data={gym} />
      );
    }.bind(this));

    var divID = "location-".concat(this.props.location)
    return (
      <div className="location" id={divID}>
        {gyms}
      </div>
    );
  }
});

module.exports = LocationGyms;
