   /** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var LocationGyms = require('./LocationGyms.react');
var $ = require('jquery');
var Loader = require('react-loader');

// Get rid of this and later implementation
var unwanted = {                 
}

var AllGyms = React.createClass ({
  parseJSON: function() {
    var gyms = $.grep(this.state.gymdata.data.gyms, function(e) {
      return !(e.name in unwanted); 
    });
    var gymToTrafficData = {};
    this.state.trafficdata.forEach(function(gym) {
      gymToTrafficData[gym.location] = gym;
    });
    gyms.forEach(function(gym) {
      $.extend(gym, gymToTrafficData[gym.name])
    });
    return gyms;
  },

  getInitialState: function(){
    return {
      loaded: false,
      gymdata: [],
      trafficdata: [],
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.trafficurl,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({trafficdata: data.diners});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var _this = this;
    var options = {scale: 0.75, lines: 7}

    if (this.state.gymdata.length == 0) {
      return (<Loader id="spinner" loaded={this.state.loaded} options={options}></Loader>);
    }

    var nestedgyms = this.parseJSON();
    return (
          <LocationGyms gymdata={nestedgyms} />
    )
  }
});

ReactDOM.render(
  <AllGyms
  trafficurl="http://cornellpulse.com:3000/api"/>,
  document.getElementById("menus")
);

module.exports = AllGyms;
