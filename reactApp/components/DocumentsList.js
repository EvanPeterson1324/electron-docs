import React from 'react';
import axios from 'axios';
//import {Editor, EditorState} from 'draft-js';
import styles from '../styles/styles';
import '../styles/container.scss';
import { Link, Redirect } from 'react-router-dom';
import AddNewDocModal from './AddNewDocModal';
import AddNewCollaboratorModal from './AddNewCollaboratorModal';

class DocumentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentIds: [],
      documents: [],
      newDocName: '',
      newDocPassword: '',
      docId: '',
      willRedirect: false
    };
    this.createDoc = this.createDoc.bind(this);
    this.attemptColaboration = this.attemptColaboration.bind(this);
    this.generateDocumentList = this.generateDocumentList.bind(this);
    this.generateColaborationList = this.generateColaborationList.bind(this);
    this.returnPromises = this.returnPromises.bind(this);
    this.openDocumentClick = this.openDocumentClick.bind(this);
  }

  componentDidMount() {
    this.setState({willRedirect: false});

    axios({
      method: 'get',
      url: 'http://localhost:3000/docs'
    })
    .then((resp) => {
      if(resp.data.user.docs.length > 0 ) {
        this.setState({documentIds: resp.data.user.docs});
      }
    })
    .then((resp2) => {
      var myPromises = this.returnPromises();
      // CHECKING FOR AN EMPTY PROMISE ARRAY
      if(myPromises.length > 0) {
        Promise.all(myPromises).then((resp) => (this.setState({documents: resp})));
      }
    })
    .catch(err => console.log("DocsList Fetch Error Response: ", err));
  }

  returnPromises() {
    return this.state.documentIds.map((doc) => {
      return axios({
        method: 'post',
        url: 'http://localhost:3000/editor/saved',
        data: {
          docId: doc.id
        }
      });
    });
  }

  // Login for this is in Add new doc modal
  createDoc() {
    this.setState({
      willRedirect: true,
    });
  }

  attemptColaboration() {

  }

  generateDocumentList() {
    console.log('MYDOCS', this.state.documents);
    if (this.state.documents.length > 0) {
      return this.state.documents.map((doc) => {
        var singleDoc = doc.data.doc;
        console.log('SINGLEDOC', singleDoc);
        return (
          <Link
            to="/textEditor"
            onClick={() => {this.openDocumentClick(singleDoc);}}>
            <p style={styles.p}>{singleDoc.title}</p>
          </Link>);
      });
    } else {
      return <p>You have no docs.</p>;
    }
  }

  generateColaborationList() {

  }

  openDocumentClick(doc) {
    this.props.history.newDocId = doc._id;
    this.props.history.currentDoc = doc;
  }

  render() {
    if(this.state.willRedirect) {
      return (
        <Redirect to="/textEditor"/>
      );
    }

    return(
      <div>

        <h1 style={styles.title}>👋🏼  Welcome {this.props.history.username}!</h1>

        <div className="alignRow">
          <AddNewDocModal
            createDoc={this.createDoc}
            history={this.props.history}
          />
        </div>

        <div className="alignRow">
          <AddNewCollaboratorModal
            attemptColaboration={this.attemptColaboration}
            history={this.props.history}
          />
        </div>


        <div className="spacer"></div>
        <div className="alignRow">
          <div className="card">
            <h1 style={styles.h2}>My Documents</h1>
            <hr style={styles.hr}></hr>
            <ul> {this.generateDocumentList()} </ul>

          </div>
          <div className="card2">
            <h1 style={styles.h2}>My Collaborations</h1>
            <hr style={styles.hr}></hr>

          </div>
        </div>
      </div>
    );
  }
}

export default DocumentsList;
