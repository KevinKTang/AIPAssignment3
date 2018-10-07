import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createAutoListPlugin from 'draft-js-autolist-plugin';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

import './MyEditor.css';
import 'draft-js-emoji-plugin/lib/plugin.css';

const richButtonsPlugin = createRichButtonsPlugin();
const {
  // inline buttons
  ItalicButton, BoldButton, UnderlineButton,
  // block buttons
  CodeButton, OLButton, ULButton, H1Button, H2Button, H3Button,
} = richButtonsPlugin;


//Instantiate emoji plugin
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

//Instantiate the autolist plugin
const autoListPlugin = createAutoListPlugin();

//Instantiate all plugins
const plugins = [
  richButtonsPlugin,
  autoListPlugin,
  emojiPlugin,
];
const text = "Tell your story";
 
class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  focus = () => {
    this.editor.focus();
  };

  render() {
    // Show loading if this.state.editorState is empty
    if (!this.state.editorState) {
      return (
        <h3 className="loading">Loading...</h3>
      );
    }
    return (
      <div className="container">
        <div className="title">
          <h1>Create A New Post</h1>
        </div>
        <div>
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeButton />
          <ULButton />
          <OLButton />
          <H1Button />
          <H2Button />
          <H3Button />
        </div>
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            // Pass the plugins to the editor
            plugins={plugins}
            // Saving a reference to the Editor component to call methods
            // of that component easily
            ref={(element) => { this.editor = element; }}
            spellCheck
          />
        </div>
        <EmojiSuggestions />
        <EmojiSelect />
      </div>
    );
  }
}

export default MyEditor;