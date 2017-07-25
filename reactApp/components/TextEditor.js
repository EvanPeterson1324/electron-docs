import React from 'react';
import {Editor, EditorState, RichUtils, /*convertToRaw,*/ DefaultDraftBlockRenderMap} from 'draft-js';
import styles from '../styles/styles';
import { Map } from 'immutable';
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
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
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
  render() {
    return (
      <div id="body">
        <div className="alignSB">
        <button style={styles.buttonLarge}>
          <span><i className="fa fa-arrow-left" aria-hidden="true"></i> Documents List</span>
        </button>
        <button style={styles.buttonSave}>
          <span><i className="fa fa-floppy-o" aria-hidden="true"></i> Save</span>
        </button>
        </div>
        <h1 style={styles.title}>🗒️  Document Title Here</h1>
        <h3 style={styles.h3}><b>By: Evan Jatharsan</b></h3>
        <h3 style={styles.h3}>Share this document ID with your collaborators: <b>###DOCUMENTID</b></h3>
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
                editorState={this.state.editorState} onChange={this.onChange}
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
