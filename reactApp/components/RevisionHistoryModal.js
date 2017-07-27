import React from 'react';
import Modal from 'react-modal';
import styles from '../styles/styles';

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

class RevisionHistoryModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getVersionList = this.getVersionList.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.fontWeight = '300';  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  getVersionList() {
    const revisionsList = this.props.generateRevisionsList;
    if(!this.state.modelIsOpen) {
      return <ul>{revisionsList(this.closeModal)}</ul>;
    }
    return <p>"Model not open"</p>;
  }

  render() {
    return (
      <div>
          <button
            style={styles.buttonRevHist}
            onClick={this.openModal}>
            <span><i className="fa fa-history" aria-hidden="true"></i> See Revision History</span>
          </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="View Revision History"
          >
            <h2 ref={subtitle => this.subtitle = subtitle}>Revisions</h2>
            {this.getVersionList()}
          </Modal>
        </div>
    );
  }
}

export default RevisionHistoryModal;
