/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');

var Gym = React.createClass({
  nameToID: function(name) {
    return name
      .replace(/\s+/g, '')
      .replace('!', '')
      .replace("\'", '')
      .replace("&", '')
      .concat("-wrapper");
  },

  onClick: function(name) {
    var divID = "#" + this.nameToID(name);
    $(divID).slideToggle(200);
  },

  render: function() {
    var _this = this;
    var name = this.props.data.name;
    var nameClass = "name " + this.props.data.status;
    var nameID = this.nameToID(name);
    var peak = this.props.data.peak;
    var currentDate = (new Date()).toISOString().slice(0, 10);    

    return (
      <div className="gym-wrapper">
        <div className={nameClass} onClick={_this.onClick.bind(_this, name)}>
          {name} (peak: {peak})
        </div>
      </div>
    );
  }
});

module.exports = Gym;
