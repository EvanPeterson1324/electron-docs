import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class AddNewCollaboratorModal extends React.Component {
  constructor() {
    super();

    this.state = {
      collabId: '',
      docPassword: '',
      modalIsOpen: false
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
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleSubmit() {

  }

  render() {
    return (
      <div>
        <button onClick={this.openModal}>Collaborate!</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Become a new collaborator!"
          >

            <h2 ref={subtitle => this.subtitle = subtitle}>Enter the collab id and password to collaborate</h2>

            <form
              onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="Collaboration Id"
                value={this.state.collabId}
                onChange={(e) => this.setState({collabId: e.target.value})}
              /> <br></br>
              <input
                type="password"
                placeholder="Document Password"
                value={this.state.docPassword}
                onChange={(e) => this.setState({docPassword: e.target.value})}
              /> <br></br>
              <input
                type="submit"
              />
            </form>
          </Modal>
        </div>
    );
  }


}

export default AddNewCollaboratorModal;
