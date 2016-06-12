   /** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var LocationEateries = require('./LocationEateries.react');
var $ = require('jquery');
var Loader = require('react-loader');

var unwanted = {
  "Hot Dog Cart": true, 
  "Bear's Den": true,
  "Cornell Dairy Bar": true                  
}

var AllEateries = React.createClass ({
  parseJSON: function() {
    var eateries = $.grep(this.state.eaterydata.data.eateries, function(e) {
      return !(e.name in unwanted); 
    });
    var eateryToTrafficData = {};
    this.state.trafficdata.forEach(function(eatery) {
      eateryToTrafficData[eatery.location] = eatery;
    });
    eateries.forEach(function(eatery) {
      $.extend(eatery, eateryToTrafficData[eatery.name])
    });
    return ([
            $.grep(eateries, (function(e) { return e.campusArea.descrshort == "North" })),
            $.grep(eateries, (function(e) { return e.campusArea.descrshort == "West" })),
            $.grep(eateries, (function(e) { return e.campusArea.descrshort == "Central" }))
            ]);
  },

  getInitialState: function(){
    return {
      loaded: false,
      eaterydata: [],
      trafficdata: [],
    };
  },

  onClick: function(location) {
    var div_id = '';
      if (location === "north") {
        div_id = "#location-north";
      }
      else if (location === "central") {
        div_id = "#location-central";
      }
      else if (location === "west") {
        div_id = "#location-west"
      }
      $(div_id).slideToggle(200);
    },

  componentDidMount: function() {
    $.ajax({
      url: this.props.eateryurl,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({eaterydata: data, loaded: true});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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

    if (this.state.eaterydata.length == 0) {
      return (<Loader id="spinner" loaded={this.state.loaded} options={options}></Loader>);
    }

    var nestedEateries = this.parseJSON();
    return (
      <div className="all-location">
        <div className="campus" id="north">
          <div className="location-header" id="location-header-north" onClick={_this.onClick.bind(_this, 'north')}> 
            <div className="campus-location">North Campus</div>
          </div>
          <LocationEateries eaterydata={nestedEateries[0]} location='north' />
        </div>
        <div className="campus" id="central">
          <div className="location-header" id="location-header-central" onClick={_this.onClick.bind(_this, 'central')}>
            <div className="campus-location">Central Campus</div>
          </div>
          <LocationEateries eaterydata={nestedEateries[1]} location='central' />
        </div>
        <div className="campus" id="west">
          <div className="location-header" id="location-header-west" onClick={_this.onClick.bind(_this, 'west')}>
            <div className="campus-location">West Campus </div>
          </div>
          <LocationEateries eaterydata={nestedEateries[2]} location='west' />
        </div>
      </div>
    )
  }
});

ReactDOM.render(
  <AllEateries eateryurl="https://now.dining.cornell.edu/api/1.0/dining/eateries.json" trafficurl="http://cornellpulse.com:3000/api"/>,
  document.getElementById("menus")
);

module.exports = AllEateries;
