import React from 'react';
import {Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertToRaw, convertFromRaw} from 'draft-js';
import axios from 'axios';
import { Map } from 'immutable';
import { Redirect } from 'react-router-dom';
import styles from '../styles/styles';
import '../styles/container.scss';
import '../styles/blockstyles.scss';
import io from 'socket.io-client'

const styleMap ={
  'STRIKETHROUGH': styles.strikethrough,
  'FONT_RED': styles.fontRed,
  'FONT_BLUE': styles.fontBlue,
  'FONT_GRAY': styles.fontGray,
};

const blockRenderMap = Map({
  'alignLeft': {
    element: 'alignLeft'
  },
  'alignRight': {
    element: 'alignRight'
  },
  'alignCenter': {
    element: 'alignCenter'
  }
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: this.props.history.newDocTitle,
      author: this.props.history.username,
      docId: this.props.history.newDocId,
      collaborators: null,
      willRedirect: false,
      thisDoc: this.props.history.currentDoc,
      socket: null
    };
    this.onChange = this.onChange.bind(this);
    this.handleSaveDocument = this.handleSaveDocument.bind(this);
  }

  componentDidMount(){
    if (this.props.history.currentDoc) {
      this.setState({
        title: this.props.history.currentDoc.title,
        author: this.props.history.currentDoc.author,
        docId: this.props.history.currentDoc._id,
        collaborators: this.props.history.currentDoc.collaborators,
      })
    }
    if (this.state.thisDoc && this.state.thisDoc.versions.length > 0) {
      var content = convertFromRaw(JSON.parse(this.state.thisDoc.versions[0].content));
      this.setState({
        editorState: EditorState.createWithContent(content),
      });
    }
    this.socket = io.connect('http://localhost:3000');
    this.setState({socket: this.socket});
    this.socket.on('broadcastEdit', stringRaw => {
      const content = convertFromRaw(JSON.parse(stringRaw));
      this.setState({editorState: EditorState.createWithContent(content)});
    });
  }
  onChange(editorState) {
    console.log("THIS IS THE STATE", this.state.editorState.getCurrentContent());
    this.setState({editorState: editorState});
    const raw = convertToRaw(this.state.editorState.getCurrentContent());
    const stringRaw = JSON.stringify(raw);
    this.state.socket.emit('liveEdit', stringRaw);
    // console.log('STRINGRAW FROM CLIENT', stringRaw);
  }
  blockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'alignLeft') {
      return 'alignLeft';
    }
    if (type === 'alignRight') {
      return 'alignRight';
    }
    if (type === 'alignCenter') {
      return 'alignCenter';
    }
    if (type === 'header-one') {
      return 'h1';
    }
    if (type === 'header-two') {
      return 'h2';
    }
    if (type === 'header-three') {
      return 'h3';
    }
    return 'none';
  }
  makeBold() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD'
    ));
  }
  makeItalic() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'ITALIC'
    ));
  }
  makeUnderline() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'UNDERLINE'
    ));
  }
  makeCode() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'CODE'
    ));
  }
  makeStrikethrough() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'STRIKETHROUGH'
    ));
  }
  makeFontRed() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'FONT_RED'
    ));
  }
  makeFontGray() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'FONT_GRAY'
    ));
  }
  makeFontBlue() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'FONT_BLUE'
    ));
  }
  enumerate() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'ordered-list-item'
    ));
  }
  unorderedList() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'unordered-list-item'
    ));
  }
  alignRight() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'alignRight'
    ));
  }
  alignCenter() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'alignCenter'
    ));
  }
  alignLeft() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'alignLeft'
    ));
  }
  h1() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'header-one'
    ));
  }
  h2() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'header-two'
    ));
  }
  h3() {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'header-three'
    ));
  }

  handleSaveDocument() {
    // Save the curr doc
    var currVersion = {
      timeStamp: new Date().toISOString(),
      content: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
      changes: {}   // TODO
    };

    // docId ---> this.state.docId
    axios({
      method: 'post',
      url: 'http://localhost:3000/save',
      data: {
        version: currVersion,
        docId: this.state.docId
      }
    })
    .then(resp => console.log('RESP FROM SAVE', resp))
    .catch(err => console.log("Save doc Err: ", err));
  }


  render() {
    if(this.state.willRedirect) {
      return (
        <Redirect to='/docList'/>
      );
    }

    return (
      <div id="body">
        <div className="alignSB">
        <button
          style={styles.buttonLarge}
          onClick={() => {this.setState({willRedirect: true});}}>
          <span><i className="fa fa-arrow-left" aria-hidden="true"></i> Documents List</span>
        </button>
        <button
          style={styles.buttonSave}
          onClick={this.handleSaveDocument}
          >
          <span><i className="fa fa-floppy-o" aria-hidden="true"></i> Save</span>
        </button>
        </div>
        <h1 style={styles.title}>🗒️  {this.state.title}</h1>
        <h3 style={styles.h3}><b>By: {this.state.author}</b></h3>
        <h3 style={styles.h3}>Share this document ID with your collaborators: <b>{this.state.docId}</b></h3>
        <div style={styles.allButTitle}>
          <div style={styles.toolbar}>
            <button style={styles.buttonflatG} onClick={() => this.makeFontGray()}>
              <i className="fa fa-font" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatR} onClick={() => this.makeFontRed()}>
              <i className="fa fa-font" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatB} onClick={() => this.makeFontBlue()}>
              <i className="fa fa-font" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatGR} onClick={() => this.h1()}>H1</button>
            <button style={styles.buttonflatGR} onClick={() => this.h2()}>H2</button>
            <button style={styles.buttonflatGR} onClick={() => this.h3()}>H3</button>
            <button style={styles.buttonflat} onClick={() => this.makeItalic()}>
              <i className="fa fa-italic" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflat} onClick={() => this.makeBold()}>
              <i className="fa fa-bold" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflat} onClick={() => this.makeItalic()}>
              <i className="fa fa-italic" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflat} onClick={() => this.makeUnderline()}>
              <i className="fa fa-underline" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflat} onClick={() => this.makeCode()}>
              <i className="fa fa-code" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflat} onClick={() => this.makeStrikethrough()}>
              <i className="fa fa-strikethrough" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatP} onClick={() => this.enumerate()}>
              <i className="fa fa-list-ol" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatP} onClick={() => this.unorderedList()}>
              <i className="fa fa-list-ul" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatT} onClick={() => this.alignLeft()}>
              <i className="fa fa-align-left" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatT} onClick={() => this.alignCenter()}>
              <i className="fa fa-align-center" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonflatT} onClick={() => this.alignRight()}>
              <i className="fa fa-align-right" aria-hidden="true"></i>
            </button>
            <button style={styles.buttonRevHist} onClick={() => this.myFunc()}>
              <span><i className="fa fa-history" aria-hidden="true"></i> See Revision History</span>
            </button>
          </div>
        </div>
        <div className="align">
          <div id="container">
              <Editor
                style={styles.editor}
                editorState={this.state.editorState} onChange={(event) => {this.onChange(event);}}
                customStyleMap={styleMap} blockStyleFn={this.blockStyleFn}
                blockRenderMap={extendedBlockRenderMap}
              />
          <script type="text/javascript"> var socket = io('localhost: 3000') socket.emit('newEvent')</script>
          </div>
        </div>

      </div>
    );
  }
}

export default TextEditor;
