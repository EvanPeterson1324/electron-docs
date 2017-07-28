import React from 'react';
import {  Route, Redirect } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import TextEditor from './TextEditor';
import DocumentsList from './DocumentsList';
//import Portal from './Portal'

class App extends React.Component {
  render() {
    return (
        <div>
            <Redirect to="/login"/>

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

            <Route
              exact={true}
              path="/docList"
              component={DocumentsList}
            />

            <Route
              exact={true}
              path="/textEditor"
              component={TextEditor}
            />

        </div>
    );
  }
}

export default App;
