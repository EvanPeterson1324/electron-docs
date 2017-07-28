import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styles from '../styles/styles';
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

class AddNewDocModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docName: '',
      docPassword: '',
      modalIsOpen: false,
      willRedirect: false,
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
    this.subtitle.style.fontWeight = '300';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleSubmit() {
    axios({
      method: 'post',
      url: 'https://dry-shelf-34995.herokuapp.com//createDoc',
      data: {
        title: this.state.docName,
        password: this.state.docPassword
      }
    })
    .then(resp => {
      if(resp.data.success) {
        this.props.history.newDocId = resp.data.docId;
        this.props.history.newDocTitle = resp.data.title;

        this.setState({
          willRedirect: true,
        });
        this.closeModal();
      }
    });
  };

  render() {
    if (this.state.willRedirect) {
      return (<Redirect to="/textEditor"/>);
    }
    return (
      <div>
        <button onClick={this.openModal} style={styles.buttonLong}>
          <span><i className="fa fa-plus-circle" aria-hidden="true"></i> New Document</span>
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Add a new Document!"
          >
            <h2 ref={subtitle => this.subtitle = subtitle}>Enter a doc title and password</h2>
            <form
              onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="Document Title"
                style={styles.inputBox}
                value={this.state.docName}
                onChange={(e) => this.setState({docName: e.target.value})}
              /> <br></br>
              <div className="spacer10"></div>
              <input
                type="password"
                placeholder="Document Password"
                style={styles.inputBox}
                value={this.state.docPassword}
                onChange={(e) => this.setState({docPassword: e.target.value})}
              /> <br></br>
              <input type="submit" style={styles.buttonMedModal}/>
            </form>
          </Modal>
        </div>
    );
  }


}

export default AddNewDocModal;
