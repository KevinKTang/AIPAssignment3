import 'draft-js/dist/Draft.css';
import './MyEditor.css';

import React from 'react';
import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import basicTextStylePlugin from './plugins/basicTextStylePlugin';
import addLinkPlugin from './plugins/addLinkPlugin';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    // Create empty editorState object to store editor data
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    /* Create an array of plugins to be passed to `Editor` */
    this.plugins = [
      addLinkPlugin,
      basicTextStylePlugin,
    ];
  }

  componentDidMount() {
    // Places the cursor into the editor
    this.focus();
  }

  // Updates editorState to new contents as we type in it
  onChange = (editorState) => {
    if (editorState.getDecorator() !== null) {
      this.setState({
        editorState,
      });
    }
  }

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState, 'BOLD'))
  }

  _onItalicClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState, 'ITALIC'))
  }

  _onUnderlineClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState, 'UNDERLINE'))
  }


  focus = () => {
    this.editor.focus();
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="container">
        <h1>Create A New Post</h1>
        <div className="toolbar" onClick={this.focus}>
          <button onMouseDown={this._onBoldClick.bind(this)}>Bold</button>
          <button onMouseDown={this._onItalicClick.bind(this)}>Italic</button>
          <button onMou={this._onUnderlineClick.bind(this)}>Underline</button>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            // Pass the plugins to the editor
            plugins={this.plugins}
            // Saving a reference to the Editor component to call methods
            // of that component easily
            ref={(element) => { this.editor = element; }}
            placeholder="Tell your story"
            spellCheck
          />
        </div>
      </div>
    );
  }
}

export default MyEditor;