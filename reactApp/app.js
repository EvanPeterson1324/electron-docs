var React = require('react');
var ReactDOM = require('react-dom');

import App from './components/App';
// import Login from './components/Login';
// import Register from './components/Register';
// import TextEditor from './components/TextEditor';
// import DocumentsList from './components/DocumentsList';
//import AddNewDocModal from './components/AddNewDocModal';
//import AddNewCollaboratorModal from './components/AddNewCollaboratorModal';
import { HashRouter as Router, hashHistory } from 'react-router-dom';



/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
//   .then(resp => resp.text())
//   .then(text => console.log(text))
//   .catch(err => {throw err;});

ReactDOM.render(
  <Router history={hashHistory}>
    <App />
  </Router>
  , document.getElementById('root'));
