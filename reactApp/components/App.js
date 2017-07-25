import React from 'react';
import {  Route } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
//import TextEditor from './TextEditor';
//import Portal from './Portal'

class App extends React.Component {
  render() {
    return (
        <div>
            <Route
              exact={true}
              path="/"
              component={Login}
            />

            <Route
              exact={true}
              path="/login"
              component={Login}
            />

            <Route
              exact={true}
              path="/register"
              component={Register}
            />
        </div>
    );
  }
}

export default App;
