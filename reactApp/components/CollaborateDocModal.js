import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import styles from '../styles/styles';
import { Redirect } from 'react-router-dom';
import '../styles/container.scss';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#f4f5f7',
    borderStyle           : 'none',
    width                 : '400px',
    padding               : '30px',
    boxShadow             : '0 2px 8px rgba(0, 0, 0, 0.1)'
  }
};

class CollaborateDocModal extends React.Component {
  constructor() {
    super();

    this.state = {
      collabId: '',
      docPassword: '',
      modalIsOpen: false,
      willRedirect: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.fontWeight = '300';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleSubmit() {
    axios({
      method: 'post',
      url: 'https://dry-shelf-34995.herokuapp.com//collaborate',
      data: {
        docId: this.state.collabId,
        password: this.state.docPassword
      }
    })
    .then((resp) => {
      if (resp.data.success) {
        this.props.history.newDocId = this.state.collabId;
        this.props.history.currentDoc = resp.data.doc;
        this.setState({willRedirect: true})
        this.closeModal();
      }
    })
  }

  render() {
    if (this.state.willRedirect) {
      return (<Redirect to="/textEditor"/>);
    }
    return (
      <div>
        <button onClick={this.openModal} style={styles.buttonLongY}>
          <span><i className="fa fa-users" aria-hidden="true"></i> Collaborate</span>
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Become a new collaborator!"
          >

            <h2 ref={subtitle => this.subtitle = subtitle}>Enter the collab ID and password</h2>
            <div>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  style={styles.inputBox}
                  placeholder="Collaboration Id"
                  value={this.state.collabId}
                  onChange={(e) => this.setState({collabId: e.target.value})}
                /> <br></br>
                <div className="spacer10"></div>
                <input
                  type="password"
                  style={styles.inputBox}
                  placeholder="Document Password"
                  value={this.state.docPassword}
                  onChange={(e) => this.setState({docPassword: e.target.value})}
                /> <br></br>
                <input type="submit" style={styles.buttonMedModal}/>
              </form>
            </div>
          </Modal>
        </div>
    );
  }
}

export default CollaborateDocModal;
