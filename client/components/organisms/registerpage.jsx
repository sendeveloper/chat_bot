import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

import LoginPage from './loginpage.jsx';

class RegisterPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      first_name:'',
      last_name:'',
      email:'',
      username: '',
      password:''
    }
  }
	render(){
		return(
			<div>
        <MuiThemeProvider>
          <div>
            <AppBar title="Register" />
            <TextField
              hintText="Enter your First Name"
              floatingLabelText="First Name"
              onChange = {(event,newValue) => this.setState({first_name:newValue})}
             />
            <br/>
            <TextField
              hintText="Enter your Last Name"
              floatingLabelText="Last Name"
              onChange = {(event,newValue) => this.setState({last_name:newValue})}
             />
            <br/>
            <TextField
              hintText="Enter your Email"
              type="email"
              floatingLabelText="Email"
              onChange = {(event,newValue) => this.setState({email:newValue})}
             />
            <br/>
            <TextField
              hintText="Enter your username"
              floatingLabelText="Username"
              onChange = {(event,newValue) => this.setState({username:newValue})}
             />
            <br/>
            <TextField
              type = "password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange = {(event,newValue) => this.setState({password:newValue})}
             />
            <br/>
            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
          </div>
        </MuiThemeProvider>
      </div>
		);
	}
  handleClick(event){
    var apiBaseUrl = "http://localhost:8080/api/";
    //To be done:check for empty values before hitting submit
    var self = this;
    var payload={
      "first_name": this.state.first_name,
      "last_name":this.state.last_name,
      "email":this.state.email,
      "username":this.state.username,
      "password":this.state.password
    }
    console.log(payload);
    axios.post(apiBaseUrl+'register', payload)
      .then(function (response) {
        console.log(response);
        if(response.data.code == 200){
          //  console.log("registration successfull");
          var loginscreen=[];
          loginscreen.push(<LoginPage parentContext={this}/>);
          var loginmessage = "Not Registered yet.Go to registration";
          self.props.parentContext.setState({loginscreen:loginscreen,
            loginmessage:loginmessage,
            buttonLabel:"Register",
            isLogin:true
          });
        }
        else if (response.data.code == 204){
          console.log("Email or Username is already existed");
          alert("Email or Username is already existed")
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

const style = {
  margin: 15,
};

export default RegisterPage;