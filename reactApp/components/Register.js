import React from 'react';
import axios from 'axios';
//import {Editor, EditorState} from 'draft-js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPwChange = this.handleConfirmPwChange.bind(this);
    this.makeRegisterRequest = this.makeRegisterRequest.bind(this);
  }


  handleUsernameChange(event) { this.setState({ username: event.target.value }); }
  handlePasswordChange(event) { this.setState({ password: event.target.value }); }
  handleConfirmPwChange(event) { this.setState({ confirmPassword: event.target.value }); }

  makeRegisterRequest() {
    axios({
      method: 'post',
      url: 'http://localhost:3000/register',
      data: {
        username: this.state.username,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      }
    })
      .then((resp) => console.log("Login Response: ", resp))
      .catch(err => console.log("Login Error Response: ", err));
  }

  render() {
    return(
      <div>
        <form onSubmit={this.makeRegisterRequest}>
          <h1>Register</h1>
          <p>Username</p>
          <input
            type="text"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUsernameChange}></input>
            <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}></input> <br></br>
              <p> Confirm Password </p>
              <input
                type="password"
                placeholder="Password"
                value={this.state.confirmPassword}
                onChange={this.handleConfirmPwChange}></input> <br></br>
                <input
                  type="submit"></input>
        </form>
      </div>
    );
  }
}

export default Register;
