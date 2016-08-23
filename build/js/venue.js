var React = require('react');
var $ = require('jquery');
var Venue = React.createClass({
    getInitialState: function(){
      return ({
          goOrNot: this.props.toggle
      });  
    },
    handleClick: function(){
      if(this.state.goOrNot){
          this.setState({
              goOrNot: false
          });
          this.props.toggleGoing(this.props.venueID, this.props.going, false, this.props.number);
      } else{
          this.setState({
              goOrNot: true
          });
          this.props.toggleGoing(this.props.venueID, this.props.going, true, this.props.number);
      }
    },
    render: function(){
        return (
            <div className="row">
                <div className="col-xs-3">
                    <img src={this.props.image} width="100%" />
                </div>
                <div className="col-xs-9">
                    <button className="btn btn-primary" onClick={this.handleClick} disabled={this.props.isDisable}>
                    {this.props.going+ " Going"}
                    </button>
                    <h4><a href={"https://www.google.com/maps/?q="+this.props.location[0]+","+this.props.location[1]} target="_blank">See this venue in google map</a></h4>
                    <h3>{this.props.name}</h3>
                </div>
            </div>
        );
    }
});

module.exports = Venue;