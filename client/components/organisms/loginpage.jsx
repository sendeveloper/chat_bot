import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

class LoginPage extends React.Component {
	constructor(props, context) {
		super(props, context);
    this.state={
      email:'',
      password:''
    }
	}
	render(){
		return(
			<div>
        <MuiThemeProvider>
          <div>
          <AppBar title="Login" />
          <TextField
            hintText="Enter your Email"
            type="email"
            floatingLabelText="Email"
            onChange = {(event,newValue) => this.setState({email:newValue})}
           />
          <br/>
          <TextField
           type="password"
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
    var self = this;
    var payload={
      "email":this.state.email,
      "password":this.state.password
    }
    console.log(payload);
    axios.post(apiBaseUrl+'login', payload) 
      .then(function (response) {
        console.log(response);
        if(response.data.code == 200){
          console.log("Login successfull");
          var uploadScreen=[];
          uploadScreen.push(<UploadScreen appContext={self.props.appContext}/>)
          self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
        }
        else if(response.data.code == 204){
          console.log("Email password do not match");
          alert("Email password do not match")
        }
        else{
          console.log("Email does not exists");
          alert("Email does not exist");
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

export default LoginPage;