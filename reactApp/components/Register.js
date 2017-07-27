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
      <div>
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
              onChange={this.handleUsernameChange}></input>
          </div>
          <div className="alignRow">
            <span className="icon"><i className="fa fa-lock" aria-hidden="true"></i></span>
              <input
                type="password"
                placeholder="Password"
                style={styles.inputBox}
                value={this.state.password}
                onChange={this.handlePasswordChange}>
              </input> <br></br>
          </div>
          <div className="alignRow">
            <span className="icon"><i className="fa fa-lock" aria-hidden="true"></i></span>
              <input
                type="password"
                placeholder="Confirm Password"
                style={styles.inputBox}
                value={this.state.confirmPassword}
                onChange={this.handleConfirmPwChange}>
              </input><br></br>
          </div>
          <div className="alignRowC">
              <input type="submit" style={styles.buttonMedNoMarginG}></input>
              <Link to="/login" style={styles.buttonMedNoMarginO}>Login</Link>
          </div>
        </form>
      </div>
      </div>
    );
  }
}

export default Register;
