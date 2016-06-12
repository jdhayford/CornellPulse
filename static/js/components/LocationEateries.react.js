   /** @jsx React.DOM */

var React = require('react');
var Eatery = require('./Eateries.react');
var $ = require('jquery');

var LocationEateries = React.createClass ({
  render: function() {
    var _this = this;
    var eateries = this.props.eaterydata.map(function(eatery) {
      return (
        <Eatery data={eatery} />
      );
    }.bind(this));

    var divID = "location-".concat(this.props.location)
    return (
      <div className="location" id={divID}>
        {eateries}
      </div>
    );
  }
});

module.exports = LocationEateries;
