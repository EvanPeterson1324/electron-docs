import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import styles from '../styles/styles';
import '../styles/container.scss';
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
      willRedirect: false,
      isSubmitDisabled: true
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.makeLoginRequest = this.makeLoginRequest.bind(this);
    this.checkFormsValid = this.checkFormsValid.bind(this);

  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value,
    });
    this.checkFormsValid();
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
    });

    this.checkFormsValid();
  }

  makeLoginRequest() {
    axios({
      method: 'post',
      url: 'http://localhost:3000/login',
      data: {
        username: this.state.username,
        password: this.state.password,
      }
    })
      .then((resp) => {
        if(resp.data.success) {
          this.setState({
            willRedirect: true
          });
        }
        console.log("Login Response: ", resp);
      })
      .catch(err => console.log("Login Error Response: ", err));
  }

  checkFormsValid() {
    const FIVE_CHARACTERS = 5;
    const EIGHT_CHARACTERS = 8;
    if(
         this.state.username.length >= FIVE_CHARACTERS
      && this.state.password.length >= EIGHT_CHARACTERS
    ) {
      this.setState({ isSubmitDisabled: false });
      return false;
    }

    // if the forms are all good, lets set the state of the isValidForm and enable
    // the submit button
    this.setState({
      isSubmitDisabled: true
    });
    return true;
  }

  render() {
    if(this.state.willRedirect) {
      this.setState({
        willRedirect: false,
      });
      this.props.history.username = this.state.username;
      return (
        <Redirect to='/docList' />
      );
    }

    return(
      <div className="alignLeft">
        <form onSubmit={this.makeLoginRequest}>
          <div className="spacer100"></div>
          <h1 className="h1NoMargin">Login</h1>
          <hr style={styles.hrLogin}></hr>
          <div className="alignRow">
            <span className="icon"><i className="fa fa-user-o" aria-hidden="true"></i></span>
            <input
              type="text"
              style={styles.inputBox}
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleUsernameChange}></input>
          </div>
          <div className="spacer10"></div>
          <div className="alignRow">
            <div className="spacerW"></div>
            <span className="icon"><i className="fa fa-lock" aria-hidden="true"></i></span>
            <input
              type="password"
              style={styles.inputBox}
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}></input> <br></br>
          </div>
          <div className="alignRowMargin">
            <Link to="/register" style={styles.buttonMedNoMarginO}>Register</Link>

            <input
              type="submit"
              style={styles.buttonMedNoMarginG}
              disabled={this.state.isSubmitDisabled}
              >
            </input>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
