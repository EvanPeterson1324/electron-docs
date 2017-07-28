import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import styles from '../styles/styles';
import '../styles/container.scss';
let timeoutId;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      arePwFieldsDisabled: true,
      isUsernameFldDisabled: false,
      isSubmitDisabled: true,
      willRedirect: false,
      thecolor: {
        fontFamily: 'Lato',
        fontSize: '14px',
        paddingLeft: '10px',
        paddingRight: '10px',
        height: '28px',
        width: '200px',
        border: 'solid',
        color: 'red',
        borderWidth: '1px',
        borderRadius: '2px',
        borderColor: '#b2b2b2'
      }
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPwChange = this.handleConfirmPwChange.bind(this);
    this.makeRegisterRequest = this.makeRegisterRequest.bind(this);
    this.checkFormsValid = this.checkFormsValid.bind(this);
    this.checkPwFieldsCanBeEnabled = this.checkPwFieldsCanBeEnabled.bind(this);
  }

  handleUsernameChange(event) {
    if(timeoutId) {
      this.setState({
        thecolor: {
          fontFamily: 'Lato',
          fontSize: '14px',
          paddingLeft: '10px',
          paddingRight: '10px',
          height: '28px',
          width: '200px',
          border: 'solid',
          color: '#4c4c4c',
          borderWidth: '1px',
          borderRadius: '2px',
          borderColor: '#b2b2b2'
        }
      })
      clearTimeout(timeoutId);
    }
    this.setState({
      username: event.target.value,
      arePwFieldsDisabled: true
    });
    if(this.state.username.length >= 5) {
      timeoutId = setTimeout(this.checkPwFieldsCanBeEnabled, 1000);
    }
  }
componentWillMount() {
  timeoutId = false;
  this.setState({
    thecolor: {
        fontFamily: 'Lato',
        fontSize: '14px',
        paddingLeft: '10px',
        paddingRight: '10px',
        height: '28px',
        width: '200px',
        border: 'solid',
        color: 'red',
        borderWidth: '1px',
        borderRadius: '2px',
        borderColor: '#b2b2b2'
    }
  })
}
  handlePasswordChange(event) {
    this.setState({ password: event.target.value }, () => {
      this.checkFormsValid();
    });
  }
  handleConfirmPwChange(event) {
    this.setState({ confirmPassword: event.target.value }, () => {
      this.checkFormsValid();

    });
  }

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
      })
      .catch(err => console.log("Register Error Response: ", err));
  }

  // this function will be called on every input change and check if the info
  // entered is valid in real time
  checkFormsValid() {
    const SEVEN_CHARACTERS = 7;
    if(this.state.password.length >= SEVEN_CHARACTERS && this.state.password === this.state.confirmPassword) {
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

  checkPwFieldsCanBeEnabled() {
    this.setState({isUsernameFldDisabled: true});
    axios({
      method: 'post',
      url: 'http://localhost:3000/findUser',
      data: {
        username: this.state.username,
      }
    })
      .then((resp) => {
        this.setState({isUsernameFldDisabled: false});
        if(resp.data.username) {
          this.setState({arePwFieldsDisabled: true});
          return false;
        }
        this.setState({arePwFieldsDisabled: false});
        return true;
      })
      .catch(err => console.log("Error in database call in checkPwFieldsCanBeEnabled: ", err));
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
      <div className="alignLeft">
        <form onSubmit={this.makeRegisterRequest}>
          <div className="spacer100"></div>
          <h1 className="h1NoMargin">Register</h1>
          <hr style={styles.hrLogin}></hr>
          <div className="alignRow">
            <span className="icon"><i className="fa fa-user-o" aria-hidden="true"></i></span>
            <input
              style={this.state.thecolor}
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              disabled={this.state.isUsernameFldDisabled}>
            </input>
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
              onChange={this.handlePasswordChange}
              disabled={this.state.arePwFieldsDisabled}>
            </input> <br></br>
          </div>
          <div className="alignRow">
            <div className="spacerW"></div>
            <span className="icon"><i className="fa fa-lock" aria-hidden="true"></i></span>
            <input
                type="password"
                style={styles.inputBox}
                placeholder="Confirm Password"
                value={this.state.confirmPassword}
                onChange={this.handleConfirmPwChange}
                disabled={this.state.arePwFieldsDisabled}>
            </input> <br></br>
          </div>
          <div className="alignRowMargin">
            <Link style={styles.buttonMedNoMarginO}to="/login">Login</Link>
            <input
              type="submit"
              style={styles.buttonMedNoMarginG}
              disabled={this.state.isSubmitDisabled}>
              </input>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
