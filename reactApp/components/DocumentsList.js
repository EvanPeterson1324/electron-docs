import React from 'react';
import axios from 'axios';
import {Editor, EditorState} from 'draft-js';
import styles from '../styles/styles';
import '../styles/container.scss';
import { Link, Redirect } from 'react-router-dom';
import CollaborateDocModal from './CollaborateDocModal';
import NewDocModal from './NewDocModal';

class DocumentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentIds: [],
      documents: [],
      newDocName: '',
      newDocPassword: '',
      docId: '',
      collabDocId: '',
      collabDocPassword: '',
      willRedirect: false,
      user: null,
    };

    this.createDoc = this.createDoc.bind(this);
    this.attemptCollaboration = this.attemptCollaboration.bind(this);
    this.generateDocumentList = this.generateDocumentList.bind(this);
    this.generateCollaborationList = this.generateCollaborationList.bind(this);
    this.returnPromises = this.returnPromises.bind(this);
    this.openDocumentClick = this.openDocumentClick.bind(this);
  }

  componentDidMount() {
    this.setState({willRedirect: false});

    axios({
      method: 'get',
      url: 'https://dry-shelf-34995.herokuapp.com//docs'
    })
    .then((resp) => {
      this.setState({user: resp.data.user, documentIds: resp.data.user.docs});
    })
    .then((resp2) => {
      var myPromises = this.returnPromises();
      Promise.all(myPromises).then((resp) => (this.setState({documents: resp})));
    })
    .catch(err => console.log("DocsList Fetch Error Response: ", err));
  }

  returnPromises() {
    return this.state.documentIds.map((doc) => {
      return axios({
        method: 'post',
        url: 'https://dry-shelf-34995.herokuapp.com//editor/saved',
        data: {
          docId: doc.id
        }
      });
    });
  }

  createDoc() {
    axios({
      method: 'post',
      url: 'https://dry-shelf-34995.herokuapp.com//createDoc',
      data: {
        title: this.state.newDocName,
        password: this.state.newDocPassword
      }
    })
    .then(resp => {
      if(resp.data.success) {
        this.props.history.newDocId = resp.data.docId;
        this.props.history.newDocTitle = resp.data.title;
        this.props.history.push('/textEditor', JSON.stringify({newDocId: resp.data.docId, newDocTitle: resp.data.title}));
        this.setState({
          willRedirect: true,
        });
      }
    });
  };

  attemptCollaboration() {
    axios({
      method: 'post',
      url: 'https://dry-shelf-34995.herokuapp.com//collaborate',
      data: {
        docId: this.state.collabDocId,
        password: this.state.collabDocPassword
      }
    })
    .then((resp) => {
      if (resp.data.success) {
        this.props.history.newDocId = this.state.collabDocId;
        this.props.history.currentDoc = resp.data.doc;
        this.setState({willRedirect: true})
      }
    })
  };

  generateDocumentList() {
    if (this.state.documents.length > 0) {
      return this.state.documents.map((doc) => {
        var singleDoc = doc.data.doc;
        if (singleDoc.author === this.state.user.username) {
          return (
            <Link
              to="/textEditor"
              onClick={() => {this.openDocumentClick(singleDoc);}}>
              <h1 style={styles.p}>{singleDoc.title}</h1>
            </Link>
          );
        }
      });
    } else {
      return (
        <p>Boo you have no docs 😓</p>
      )
    };
  };

  generateCollaborationList() {
    if (this.state.documents.length > 0) {
      return this.state.documents.map((doc) => {
        var singleDoc = doc.data.doc;
        if (singleDoc.author !== this.state.user.username) {
          return (
            <Link
              to="/textEditor"
              onClick={() => {this.openDocumentClick(singleDoc);}}>
              <h1 style={styles.p}>{singleDoc.title}</h1>
            </Link>
          );
        }
      });
    } else {
      return (
        <p>Boo you have no docs 😓</p>
      )
    };
  };

    openDocumentClick(doc) {
      this.props.history.newDocId = doc._id;
      this.props.history.currentDoc = doc;
    }

    render() {
      if(this.state.willRedirect) {
        return (<Redirect to="/textEditor"/>);
      }
      return(
        <div className="alignLeft50">
          <div className="spacer65"></div>
          <h1 style={styles.title}>👋🏼  Hey {this.props.history.username}!</h1>
          <div className="alignRow">
            <NewDocModal createDoc={this.createDoc} history={this.props.history}/>
            <CollaborateDocModal attemptCollaboration={this.attemptCollaboration} history={this.props.history}/>
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
              <ul> {this.generateCollaborationList()} </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  export default DocumentsList;
