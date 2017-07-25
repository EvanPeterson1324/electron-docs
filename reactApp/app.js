var React = require('react');
var ReactDOM = require('react-dom');
import { HashRouter as Router } from 'react-router-dom';
//import Login from './components/Login';
import App from './components/App';
// import Register from './components/Register';
// import TextEditor from './components/TextEditor';

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
//   .then(resp => resp.text())
//   .then(text => console.log(text))
//   .catch(err => {throw err;});

ReactDOM.render(
  <Router>
    <App />
  </Router>
  , document.getElementById('root'));
