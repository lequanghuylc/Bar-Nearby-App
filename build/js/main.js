var React = require('react');
var $ = require('jquery');
var Menu = require('./menu');
var ReactDOM = require('react-dom');
var Venue = require('./venue');
var Main = React.createClass({
    getInitialState: function(){
      return ({
          username: '',
          password: '',
          loginMessage: '',
          notLoggedin: true,
          showForm: false,
          finding: false,
          result: '',
      });  
    },
    componentWillMount: function(){
        $.get( "/checklogin", function( data ) {
          if(data !== "false"){
              this.setState({notLoggedin: false, username:data, showForm: false});
          } else {
              this.setState({showForm: true});
          }
        }.bind(this));
    },
    handleInputLogin: function(e){
        this.setState({
            username: this.refs.username.value,
            password: this.refs.password.value
        });
    },
    handleForm: function(e){
        e.preventDefault();
        if(this.state.username == '' || this.state.password == ''){
            this.setState({
                loginMessage: 'Please enter username/password'
            });
        } else {
            this.setState({ loginMessage: ''});
            $.post("/login", {user: this.state.username, pass: this.state.password}, function(result){
                this.setState({
                    loginMessage: result.accept ? "login succes" : "wrong user/pass",
                    notLoggedin: result.accept ? false : true,
                    showForm: result.accept ? false : true,
                });
                // clear all cookie
                document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                // add my new cookie
                document.cookie = result.accept ? "user=" + this.state.username + ";" : null;
                document.cookie = result.accept ? "au=" + result.cookie + ";"  : null;
            }.bind(this));
        }
    },
    logout: function(e){ 
      e.preventDefault();
          this.setState({
            notLoggedin: true,
            showForm: true,
            loginMessage: 'you just logged out'
          });
          //clear cookie
          document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });  
        return false;
        
    },
    findLocation: function(query, callback){
        navigator.geolocation.getCurrentPosition(function(position){
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                url: "https://api.foursquare.com/v2/venues/search?client_id=SCXHSM3LWAUFV11FDGAVQ4IVN1NBZ3B5TXE1FN1GNHBPBHFS&client_secret=CTFXPI2Y4UPZYECGRWIGVQ4L1IGURSNDVQLFUJDNH2XZE0PF&v=20130815&ll="+position.coords.latitude+","+position.coords.longitude+"&query="+query
            });
            callback();
        }.bind(this));
      
    },
    receiveData: function(){
      $.getJSON( this.state.url, function( data ) {
          var resultData = [];
          data.response.venues.map(function(val, index){
              var url = "https://api.foursquare.com/v2/venues/"+val.id+"/photos?client_id=SCXHSM3LWAUFV11FDGAVQ4IVN1NBZ3B5TXE1FN1GNHBPBHFS&client_secret=CTFXPI2Y4UPZYECGRWIGVQ4L1IGURSNDVQLFUJDNH2XZE0PF&v=20130815";
                  $.getJSON(url, function(data2){
                      if(data2.response.photos.count !== 0){
                              var prefix = data2.response.photos.items[0]["prefix"];
                              var suffix = data2.response.photos.items[0].suffix;
                              var size = data2.response.photos.items[0].width + "x" + data2.response.photos.items[0].height;
                              var img = prefix + size + suffix;
                        } else {
                            var img = "//dummyimage.com/600x400/CCCCCC/000000.png&text=no+image";
                        }
                        $.get("/getgoing/"+val.id, function(data3){
                            if(data3.length ===0){ var going = 0;}
                            else {var going = data3[0].going;}
                            resultData.push({
                                 "id": val.id,
                                 "image": img,
                                 "location": [val.location.lat, val.location.lng],
                                 "distance": val.location.distance,
                                 "name": val.name,
                                 "going": going
                              });
                              this.setState({
                                  finding: false,
                                  result: resultData
                              });
                        }.bind(this));
                      
                  }.bind(this));
          }.bind(this));
                
        }.bind(this));  
    },
    findBar: function(e){
        e.preventDefault();
        this.setState({finding: true});
        this.findLocation("bar", function(){
            this.receiveData(); 
        }.bind(this));
        
    },
    findOther: function(e){
        e.preventDefault();
        this.setState({finding: true});
        this.findLocation(this.refs.searchinput.value, function(){
            this.receiveData(); 
        }.bind(this));
    },
    toggleGoing: function(id, going, boo){
        if(boo){
            if(going === 0){
                
            } else {
                
            }
        } else {
            if(going ===0){
                
            } else {
                
            }
        }
    },
    render: function(){
        var generateBar = this.state.finding ? "finding..." : "";
        var result = typeof this.state.result === "string" ? this.state.result : this.state.result.map(function(val, index){
             
            return (
                <Venue key={index} venueID={val.id} location={val.location} toggleGoing={this.toggleGoing} isDisable={this.state.notLoggedin}
                     going={val.going} image={val.image} distance={val.distance} name={val.name}/>
            );
        }.bind(this));
        if(this.state.notLoggedin === false){
            var generateMenu = [
                <Menu text={"Welcome "+this.state.username} key="1"/>,
                <Menu text="My Places" key="4" />,
                <Menu text="Logout" logout={this.logout} key="5"/>
                ];
            var generateLoginForm = [];
        } else {
            var generateMenu = [];
            var generateLoginForm = this.state.showForm === false ? [] : [
                <form className="navbar-form navbar-right form-inline" role="search" onSubmit={this.handleForm} key={"loginform"}>
                  <div className="form-group">
                    <span className="login-notify">{this.state.loginMessage}</span>
                    <input type="text" className="form-control" placeholder="Username" ref="username" onChange={this.handleInputLogin}/>
                    <input type="password" className="form-control" placeholder="Password" ref="password" onChange={this.handleInputLogin}/>
                  </div>
                  <button type="submit" className="btn btn-default">Login or Register</button>
                </form>
                ];
        }
    return (
        <div>
        <header>
      <nav className="navbar navbar-default" role="navigation">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">Bar Nearby</a>
            </div>
            <div className="collapse navbar-collapse" id="collapse">
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="/">Home</a></li>
                    {generateMenu}
                </ul>
                {generateLoginForm}
            </div>
            </nav>
            </header>
            <main>
                <form>
                    <input type="text" className="form-control form-group" ref="searchinput"/>
                    <div className="btn-group inline">
                        <button className="btn btn-info" onClick={this.findOther}>Find venue</button>
                        <button className="btn btn-primary" onClick={this.findBar}>or Just find Bar</button>
                    </div>
                </form>
                <section>
                    {generateBar}
                    {result}
                </section>
            </main>
            </div>
    );
  }
});

ReactDOM.render(<Main />, document.querySelector(".container"));

