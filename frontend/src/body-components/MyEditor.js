import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createAutoListPlugin from 'draft-js-autolist-plugin';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

import '../styles/MyEditor.css';
import 'draft-js-emoji-plugin/lib/plugin.css';

/* 
    The MyEditor component is responsible for rich text editing
    in the content part of the Create Blog form, it allows for a number of 
    formatting options such as Bold, Italic and Underline. 
*/

//Instantiate the rich buttons plugin
const richButtonsPlugin = createRichButtonsPlugin();
const {
  // inline buttons
  ItalicButton, BoldButton, UnderlineButton,
  // block buttons
  CodeButton,BlockquoteButton, OLButton, ULButton, H1Button, H2Button, H3Button,
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
const text = '';

class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: createEditorStateWithText(text)
    };
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    });
    this.props.updateParent(this.state.editorState);
  }

  focus = () => {
    this.editor.focus();
  };

  // Renders a toolbar containing formatting options and the empty input editor 
  render() {
    return (
      <div className="container">
        <div>
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <b> | &nbsp; </b>
          <CodeButton />
          <BlockquoteButton />
          <H1Button />
          <H2Button />
          <H3Button />
          <ULButton />
          <OLButton />

        </div>
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            // Pass the plugins to the editor
            plugins={plugins}
            // Saving a reference to the Editor component to call methods of that component easily
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