import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import styles from '../styles/styles';
import '../styles/container.scss';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      willRedirect: false
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
      .then((resp) => {
        this.setState({willRedirect: true});
        console.log("Register Response: ", resp);
      })
      .catch(err => console.log("Register Error Response: ", err));
  }

  render() {
    if(this.state.willRedirect) {
      this.setState({
        willRedirect: false,
      });

      return (
        <Redirect to="/login" />
      );
    }
    return(
      <div className="alignCenter">
        <div className="spacer50"></div>
        <form onSubmit={this.makeRegisterRequest}>
          <h1 className="h1NoMargin">Register</h1>
          <div className="alignRow">
            <span className="icon"><i className="fa fa-user-o" aria-hidden="true"></i></span>
            <input
              style={styles.inputBox}
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleUsernameChange}>
            </input>
          </div>
            <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}>
            </input> <br></br>
            <p> Confirm Password </p>
            <input
                type="password"
                placeholder="Confirm Password"
                value={this.state.confirmPassword}
                onChange={this.handleConfirmPwChange}>
            </input> <br></br>
            <input
                type="submit">
            </input>
        </form>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default Register;
