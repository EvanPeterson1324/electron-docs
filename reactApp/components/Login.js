import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * This component allows the user to attempt to login to our app,
 * and if successful, will be brought to the list of documents they have saved.
 * If they are unsuccessful, we will keep them on the login page.
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.makeLoginRequest = this.makeLoginRequest.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value,
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
    });
  }

  makeLoginRequest() {
    axios({
      method: 'post',
      url: 'http://localhost:3000/login',
      data: {
        username: this.state.username,
        lastName: this.state.password,
      }
    })
      .then((resp) => {console.log("Login Response: ", resp);})
      .catch(err => console.log("Login Error Response: ", err));
  }

  render() {
    return(
      <div>
        <form onSubmit={this.makeLoginRequest}>
          <h1>Login</h1>
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
          <input
            type="submit"
            ></input>
        </form>
        <Link to="/register">Register</Link>
      </div>
    );
  }
}

export default Login;
