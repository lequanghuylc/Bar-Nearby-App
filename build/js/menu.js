var React = require('react');

var Menu = React.createClass({
    handleClick: function(e){
      if(this.props.logout){
          this.props.logout(e);
      } else if(this.props.addPoll){
          this.props.addPoll();
      } else if(this.props.myPoll){
          this.props.myPoll();
      }
    },
    render: function(){
        return (<li><a onClick={this.handleClick}>{this.props.text}</a></li>);
    }
});

module.exports = Menu;